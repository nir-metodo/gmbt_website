import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
  ConnectionLineType,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import '@xyflow/react/dist/style.css';
import './BotFlowBuilder.css';
import { getBotFlowT } from './translations';
import { BotFlowLangContext, useBotFlowLang } from './BotFlowLangContext';

// API for email export - override with REACT_APP_BOT_FLOW_EXPORT_API for Logic App URL (public, no auth)
const BOT_FLOW_EXPORT_API =
  process.env.REACT_APP_BOT_FLOW_EXPORT_API ||
  'https://gambot.azurewebsites.net/api/BotFlow/ExportToEmail';
// Base URL for API - media upload uses Demo API (g1 org for demo/website)
const BOT_FLOW_API_BASE =
  process.env.REACT_APP_BACKEND_URL ||
  (typeof URL !== 'undefined' ? new URL(BOT_FLOW_EXPORT_API).origin : 'https://gambot.azurewebsites.net');

const getTriggerTypes = (t) => [
  { type: 'trigger_regular', label: t.triggers.regular, icon: '📩', color: '#059669' },
  { type: 'trigger_button', label: t.triggers.button, icon: '🔘', color: '#0d9488' },
  { type: 'trigger_webhook', label: t.triggers.webhook, icon: '🔗', color: '#6366f1' },
  { type: 'trigger_new_user', label: t.triggers.newUser, icon: '👋', color: '#10b981' },
];

const getActionTypes = (t) => [
  { type: 'message_regular', label: t.actions.message_regular, icon: '💬', color: '#2e6155' },
  { type: 'message_template', label: t.actions.message_template, icon: '📤', color: '#047857' },
  { type: 'message_ai', label: t.actions.message_ai, icon: '🤖', color: '#8b5cf6' },
  { type: 'message_media', label: t.actions.message_media, icon: '🖼️', color: '#0891b2' },
  { type: 'transfer', label: t.actions.transfer, icon: '👤', color: '#8b5cf6' },
  { type: 'change_owner', label: t.actions.change_owner, icon: '🔄', color: '#7c3aed' },
  { type: 'status', label: t.actions.status, icon: '📊', color: '#f59e0b' },
  { type: 'create_lead', label: t.actions.create_lead, icon: '➕', color: '#3b82f6' },
  { type: 'update_lead', label: t.actions.update_lead, icon: '✏️', color: '#06b6d4' },
  { type: 'create_case', label: t.actions.create_case, icon: '📋', color: '#0ea5e9' },
  { type: 'update_case', label: t.actions.update_case, icon: '📝', color: '#14b8a6' },
  { type: 'update_category', label: t.actions.update_category, icon: '📁', color: '#a855f7' },
  { type: 'update_contact_tags', label: t.actions.update_contact_tags, icon: '🏷️', color: '#ec4899' },
];

// Trigger node - הודעה נכנסת / לחיצה על לחצן / Webhook / משתמש חדש - עריכה עם טקסט ומדיה
const TriggerNode = ({ id, data, selected }) => {
  const { setNodes } = useReactFlow();
  const { t, lang } = useBotFlowLang();
  const TRIGGER_TYPES = getTriggerTypes(t);
  const isButton = data?.triggerType === 'trigger_button';
  const isWebhook = data?.triggerType === 'trigger_webhook';
  const isNewUser = data?.triggerType === 'trigger_new_user';
  const buttons = data?.buttons || [];
  const triggerInfo = TRIGGER_TYPES.find((tr) => tr.type === data?.triggerType) || TRIGGER_TYPES[0];
  const defaultLabel = isButton ? t.triggerDefaults.button : isWebhook ? t.triggerDefaults.webhook : isNewUser ? t.triggerDefaults.newUser : t.triggerDefaults.regular;

  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');
  const [mediaUploading, setMediaUploading] = React.useState(false);
  const [pendingMediaFile, setPendingMediaFile] = React.useState(null);
  const [pendingMediaDataUrl, setPendingMediaDataUrl] = React.useState(null);
  const [pendingMediaType, setPendingMediaType] = React.useState(null);
  const [pendingMediaRemoved, setPendingMediaRemoved] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const content = data?.label ?? '';
  const mediaUrl = data?.mediaUrl;
  const mediaType = data?.mediaType || 'image';

  const handleEdit = () => {
    setEditValue(content);
    setPendingMediaFile(null);
    setPendingMediaDataUrl(null);
    setPendingMediaType(null);
    setPendingMediaRemoved(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    let finalMediaUrl = mediaUrl;
    let finalMediaType = mediaType;
    let finalMediaFileName = data?.mediaFileName;
    if (pendingMediaRemoved) {
      finalMediaUrl = undefined;
      finalMediaType = undefined;
      finalMediaFileName = undefined;
    } else if (pendingMediaFile) {
      setMediaUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', pendingMediaFile);
        const res = await fetch(`${BOT_FLOW_API_BASE}/api/Demo/upload-media`, {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();
        if (json?.success && json?.url) {
          finalMediaUrl = json.url;
          finalMediaType = pendingMediaType || 'image';
          finalMediaFileName = pendingMediaFile.name;
        }
      } catch (err) {
        console.error('Media upload failed:', err);
      }
      setMediaUploading(false);
    }
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                label: editValue,
                mediaUrl: finalMediaUrl,
                mediaType: finalMediaType,
                mediaFileName: finalMediaFileName,
              },
            }
          : n
      )
    );
    setPendingMediaFile(null);
    setPendingMediaDataUrl(null);
    setPendingMediaType(null);
    setPendingMediaRemoved(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(content);
    setPendingMediaFile(null);
    setPendingMediaDataUrl(null);
    setPendingMediaType(null);
    setPendingMediaRemoved(false);
    setIsEditing(false);
  };

  const handleMediaSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setPendingMediaRemoved(false);
    const type = file.type?.startsWith('image/') ? 'image' : file.type?.startsWith('video/') ? 'video' : 'document';
    setPendingMediaType(type);
    setPendingMediaFile(file);
    const reader = new FileReader();
    reader.onload = () => setPendingMediaDataUrl(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveMedia = () => {
    setPendingMediaFile(null);
    setPendingMediaDataUrl(null);
    setPendingMediaType(null);
    setPendingMediaRemoved(!!mediaUrl);
  };

  const previewMediaUrl = pendingMediaDataUrl || (pendingMediaRemoved ? null : mediaUrl);
  const previewMediaType = pendingMediaType || mediaType;

  return (
    <div
      className={`bot-flow-trigger-node ${selected ? 'selected' : ''}`}
      style={{ borderRightColor: triggerInfo.color }}
    >
      <div className="bot-flow-node-header">
        <span className="bot-flow-action-icon">{triggerInfo.icon}</span>
        {triggerInfo.label}
      </div>
      {isEditing ? (
        <div className="bot-flow-node-edit-wrap nodrag">
          <textarea
            className="bot-flow-node-content bot-flow-node-content-editable"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={t.messages.addText}
            rows={3}
            dir={lang === 'he' ? 'rtl' : 'ltr'}
            autoFocus
          />
          <div className="bot-flow-node-media-edit">
            <div className="bot-flow-media-label">{t.messages.media}</div>
            {previewMediaUrl ? (
              <div className="bot-flow-media-preview-wrap">
                {previewMediaType === 'image' && <img src={previewMediaUrl} alt="" className="bot-flow-media-preview" />}
                {(previewMediaType === 'video' || previewMediaType === 'document') && (
                  <span className="bot-flow-media-icon">{previewMediaType === 'video' ? '🎬' : '📄'}</span>
                )}
                <button type="button" className="bot-flow-media-remove nodrag" onClick={handleRemoveMedia} title={t.messages.removeMedia}>
                  ✕
                </button>
              </div>
            ) : (
              <label className="bot-flow-media-upload-btn nodrag">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={handleMediaSelect}
                  style={{ display: 'none' }}
                />
                {t.messages.addMedia}
              </label>
            )}
          </div>
          <div className="bot-flow-node-edit-actions">
            <button
              type="button"
              className="bot-flow-edit-btn bot-flow-edit-save nodrag"
              onClick={handleSave}
              disabled={mediaUploading}
              title={t.messages.save}
            >
              {mediaUploading ? t.messages.uploading : '✓'}
            </button>
            <button type="button" className="bot-flow-edit-btn bot-flow-edit-cancel nodrag" onClick={handleCancel} title={t.messages.cancel}>
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className="bot-flow-message-preview">
          {mediaUrl && (
            <div className="bot-flow-preview-media">
              {mediaType === 'image' && <img src={mediaUrl} alt="" />}
              {(mediaType === 'video' || mediaType === 'document') && (
                <div className="bot-flow-preview-media-placeholder">
                  {mediaType === 'video' ? `🎬 ${t.messages.video}` : `📄 ${t.messages.document}`}
                </div>
              )}
            </div>
          )}
          <div className={`bot-flow-preview-caption ${!content ? 'bot-flow-preview-placeholder' : ''}`}>
            {content || defaultLabel}
          </div>
          <button type="button" className="bot-flow-edit-trigger nodrag" onClick={handleEdit} title={t.messages.edit}>
            ✎
          </button>
        </div>
      )}
      {isButton && buttons.length > 0 && (
        <div className="bot-flow-node-buttons">
          {buttons.map((btn, i) => (
            <div key={i} className="bot-flow-button-with-handle">
              <span className="bot-flow-button-chip">{btn.text || t.defaults.button}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={btn.payload || `btn-${i}`}
                className="bot-flow-handle bot-flow-handle-in-button"
              />
            </div>
          ))}
        </div>
      )}
      {(!isButton || buttons.length === 0) && (
        <Handle type="source" position={Position.Right} id="default" className="bot-flow-handle" />
      )}
    </div>
  );
};

// Message node (for sending) - רגילה, טמפלט עם לחצנים, או AI - עריכה עם hover + V/X + מדיה
// העלאת מדיה רק בלחיצה על ✓; עד אז preview מקומי (data URL)
const MessageNode = ({ id, data, selected }) => {
  const { setNodes } = useReactFlow();
  const { t, lang } = useBotFlowLang();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');
  const [mediaUploading, setMediaUploading] = React.useState(false);
  const [pendingMediaFile, setPendingMediaFile] = React.useState(null);
  const [pendingMediaDataUrl, setPendingMediaDataUrl] = React.useState(null);
  const [pendingMediaType, setPendingMediaType] = React.useState(null);
  const [pendingMediaRemoved, setPendingMediaRemoved] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const isTemplate = data?.messageType === 'message_template';
  const isAi = data?.messageType === 'message_ai';
  const isMedia = data?.messageType === 'message_media';
  const hasMediaSupport = !isAi;
  const buttons = data?.buttons || [];
  const msgLabel = isAi ? t.messages.msgAi : isTemplate ? t.messages.msgTemplate : isMedia ? t.messages.msgMedia : t.messages.msgRegular;
  const content = data?.label ?? '';
  const mediaUrl = data?.mediaUrl;
  const mediaType = data?.mediaType || 'image';
  const handleEdit = () => {
    setEditValue(content);
    setPendingMediaFile(null);
    setPendingMediaDataUrl(null);
    setPendingMediaType(null);
    setPendingMediaRemoved(false);
    setIsEditing(true);
  };
  const handleSave = async () => {
    let finalMediaUrl = mediaUrl;
    let finalMediaType = mediaType;
    let finalMediaFileName = data?.mediaFileName;
    if (pendingMediaRemoved) {
      finalMediaUrl = undefined;
      finalMediaType = undefined;
      finalMediaFileName = undefined;
    } else if (pendingMediaFile) {
      setMediaUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', pendingMediaFile);
        const res = await fetch(`${BOT_FLOW_API_BASE}/api/Demo/upload-media`, {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();
        if (json?.success && json?.url) {
          finalMediaUrl = json.url;
          finalMediaType = pendingMediaType || 'image';
          finalMediaFileName = pendingMediaFile.name;
        }
      } catch (err) {
        console.error('Media upload failed:', err);
      }
      setMediaUploading(false);
    }
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                label: editValue,
                mediaUrl: finalMediaUrl,
                mediaType: finalMediaType,
                mediaFileName: finalMediaFileName,
              },
            }
          : n
      )
    );
    setPendingMediaFile(null);
    setPendingMediaDataUrl(null);
    setPendingMediaType(null);
    setPendingMediaRemoved(false);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditValue(content);
    setPendingMediaFile(null);
    setPendingMediaDataUrl(null);
    setPendingMediaType(null);
    setPendingMediaRemoved(false);
    setIsEditing(false);
  };
  const handleMediaSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setPendingMediaRemoved(false);
    const type = file.type?.startsWith('image/') ? 'image' : file.type?.startsWith('video/') ? 'video' : 'document';
    setPendingMediaType(type);
    setPendingMediaFile(file);
    const reader = new FileReader();
    reader.onload = () => setPendingMediaDataUrl(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const handleRemoveMedia = () => {
    setPendingMediaFile(null);
    setPendingMediaDataUrl(null);
    setPendingMediaType(null);
    setPendingMediaRemoved(!!mediaUrl);
  };
  const previewMediaUrl = pendingMediaDataUrl || (pendingMediaRemoved ? null : mediaUrl);
  const previewMediaType = pendingMediaType || mediaType;
  return (
    <div className={`bot-flow-message-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} id="target" className="bot-flow-handle" />
      <div className="bot-flow-node-header">{msgLabel}</div>
      {isEditing ? (
        <div className="bot-flow-node-edit-wrap nodrag">
          {/* For media messages: show media picker first, caption below */}
          {isMedia ? (
            <>
              <div className="bot-flow-node-media-edit" style={{ marginBottom: '8px' }}>
                <div className="bot-flow-media-label" style={{ fontWeight: '700', color: '#0891b2' }}>
                  {t.messages.addMediaRequired}
                </div>
                {previewMediaUrl ? (
                  <div className="bot-flow-media-preview-wrap">
                    {previewMediaType === 'image' && <img src={previewMediaUrl} alt="" className="bot-flow-media-preview" />}
                    {(previewMediaType === 'video' || previewMediaType === 'document') && (
                      <span className="bot-flow-media-icon">{previewMediaType === 'video' ? '🎬' : '📄'}</span>
                    )}
                    <button type="button" className="bot-flow-media-remove nodrag" onClick={handleRemoveMedia} title={t.messages.removeMedia}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="bot-flow-media-upload-btn nodrag" style={{ borderColor: '#0891b2', color: '#0891b2' }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                      onChange={handleMediaSelect}
                      style={{ display: 'none' }}
                    />
                    {t.messages.addMedia}
                  </label>
                )}
              </div>
              <textarea
                className="bot-flow-node-content bot-flow-node-content-editable"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={t.messages.caption}
                rows={2}
                dir={lang === 'he' ? 'rtl' : 'ltr'}
              />
            </>
          ) : (
            <>
              <textarea
                className="bot-flow-node-content bot-flow-node-content-editable"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={t.messages.addText}
                rows={3}
                dir={lang === 'he' ? 'rtl' : 'ltr'}
                autoFocus
              />
              {hasMediaSupport && (
                <div className="bot-flow-node-media-edit">
                  <div className="bot-flow-media-label">{t.messages.media}</div>
                  {previewMediaUrl ? (
                    <div className="bot-flow-media-preview-wrap">
                      {previewMediaType === 'image' && <img src={previewMediaUrl} alt="" className="bot-flow-media-preview" />}
                      {(previewMediaType === 'video' || previewMediaType === 'document') && (
                        <span className="bot-flow-media-icon">{previewMediaType === 'video' ? '🎬' : '📄'}</span>
                      )}
                      <button type="button" className="bot-flow-media-remove nodrag" onClick={handleRemoveMedia} title={t.messages.removeMedia}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="bot-flow-media-upload-btn nodrag">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                        onChange={handleMediaSelect}
                        style={{ display: 'none' }}
                      />
                      {t.messages.addMedia}
                    </label>
                  )}
                </div>
              )}
            </>
          )}
          <div className="bot-flow-node-edit-actions">
            <button
              type="button"
              className="bot-flow-edit-btn bot-flow-edit-save nodrag"
              onClick={handleSave}
              disabled={mediaUploading}
              title={t.messages.save}
            >
              {mediaUploading ? t.messages.uploading : '✓'}
            </button>
            <button type="button" className="bot-flow-edit-btn bot-flow-edit-cancel nodrag" onClick={handleCancel} title={t.messages.cancel}>
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className="bot-flow-message-preview">
          {mediaUrl && hasMediaSupport && (
            <div className="bot-flow-preview-media">
              {mediaType === 'image' && <img src={mediaUrl} alt="" />}
              {(mediaType === 'video' || mediaType === 'document') && (
                <div className="bot-flow-preview-media-placeholder">
                  {mediaType === 'video' ? `🎬 ${t.messages.video}` : `📄 ${t.messages.document}`}
                </div>
              )}
            </div>
          )}
          {/* Media message with no media yet: show placeholder */}
          {isMedia && !mediaUrl && (
            <div className="bot-flow-preview-placeholder" style={{ color: '#0891b2', fontSize: '12px', padding: '6px 0' }}>
              🖼️ {t.defaults.msgMedia}
            </div>
          )}
          {/* Regular/template: always show text. Media: show caption only if present */}
          {!isMedia ? (
            <div className={`bot-flow-preview-caption ${!content ? 'bot-flow-preview-placeholder' : ''}`}>
              {content || t.messages.addText}
            </div>
          ) : content ? (
            <div className="bot-flow-preview-caption">{content}</div>
          ) : null}
          <button type="button" className="bot-flow-edit-trigger nodrag" onClick={handleEdit} title={t.messages.edit}>
            ✎
          </button>
        </div>
      )}
      {isTemplate && (
        <div className="bot-flow-node-buttons">
          {buttons.map((btn, i) => (
            <div key={i} className="bot-flow-button-with-handle">
              <span className="bot-flow-button-chip">{btn.text || t.defaults.button}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={btn.payload || `btn-${i}`}
                className="bot-flow-handle bot-flow-handle-in-button"
              />
            </div>
          ))}
        </div>
      )}
      {/* Source handle: always show unless it's a template WITH buttons (those have per-button handles) */}
      {(!isTemplate || buttons.length === 0) ? (
        <Handle type="source" position={Position.Right} id="default" className="bot-flow-handle" />
      ) : null}
    </div>
  );
};

// Configurable action types - edit inline on the node when selected
const CONFIGURABLE_ACTIONS = ['transfer', 'change_owner', 'status', 'update_category', 'update_contact_tags'];

// Custom node for action - different types, config edit inline on the component
const ActionNode = ({ id, data, selected }) => {
  const { setNodes } = useReactFlow();
  const { t, lang } = useBotFlowLang();
  const ACTION_TYPES = getActionTypes(t);
  const actionInfo = ACTION_TYPES.find((a) => a.type === data?.actionType) || ACTION_TYPES[0];
  const config = data?.config || {};
  const isConfigurable = CONFIGURABLE_ACTIONS.includes(data?.actionType);

  let summary = data?.label || '';
  if (!summary && isConfigurable) {
    if (data?.actionType === 'transfer' && config?.agentName) summary = config.agentName;
    else if (data?.actionType === 'change_owner' && config?.ownerName) summary = config.ownerName;
    else if (data?.actionType === 'status' && config?.status) {
      const opt = (t.statusOptions || []).find((o) => o.value === config.status);
      summary = opt?.label || config.status;
    } else if (data?.actionType === 'update_category' && config?.category) summary = config.category;
    else if (data?.actionType === 'update_contact_tags' && config?.tags) summary = config.tags;
  }

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, config: newConfig } } : n
      )
    );
  };

  const showEdit = selected && isConfigurable;

  return (
    <div
      className={`bot-flow-action-node ${selected ? 'selected' : ''}`}
      style={{ borderRightColor: actionInfo.color }}
    >
      <Handle type="target" position={Position.Left} id="target" className="bot-flow-handle" />
      <div className="bot-flow-node-header">
        <span className="bot-flow-action-icon">{actionInfo.icon}</span>
        {actionInfo.label}
      </div>
      {showEdit ? (
        <div className="bot-flow-node-edit-wrap nodrag" dir={lang === 'he' ? 'rtl' : 'ltr'}>
          {data?.actionType === 'transfer' && (
            <div className="bot-flow-action-field">
              <label>{t.panel.agentName}</label>
              <input
                type="text"
                value={config?.agentName || ''}
                onChange={(e) => handleConfigChange('agentName', e.target.value)}
                placeholder={t.panel.agentName}
                className="bot-flow-properties-input"
              />
            </div>
          )}
          {data?.actionType === 'change_owner' && (
            <div className="bot-flow-action-field">
              <label>{t.panel.ownerName}</label>
              <input
                type="text"
                value={config?.ownerName || ''}
                onChange={(e) => handleConfigChange('ownerName', e.target.value)}
                placeholder={t.panel.ownerName}
                className="bot-flow-properties-input"
              />
            </div>
          )}
          {data?.actionType === 'status' && (
            <div className="bot-flow-action-field">
              <label>{t.panel.statusLabel}</label>
              <select
                value={config?.status || ''}
                onChange={(e) => handleConfigChange('status', e.target.value)}
                className="bot-flow-properties-input"
              >
                <option value="">{t.panel.statusLabel}...</option>
                {(t.statusOptions || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {data?.actionType === 'update_category' && (
            <div className="bot-flow-action-field">
              <label>{t.panel.categoryLabel}</label>
              <input
                type="text"
                value={config?.category || ''}
                onChange={(e) => handleConfigChange('category', e.target.value)}
                placeholder={t.panel.categoryLabel}
                className="bot-flow-properties-input"
              />
            </div>
          )}
          {data?.actionType === 'update_contact_tags' && (
            <div className="bot-flow-action-field">
              <label>{t.panel.tagsLabel}</label>
              <input
                type="text"
                value={config?.tags || ''}
                onChange={(e) => handleConfigChange('tags', e.target.value)}
                placeholder={t.panel.tagsPlaceholder}
                className="bot-flow-properties-input"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bot-flow-node-content">{summary || ''}</div>
      )}
      <Handle type="source" position={Position.Right} id="default" className="bot-flow-handle" />
    </div>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  action: ActionNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: {
      triggerType: 'trigger_button',
      label: 'כשלחיצה על לחצן',
      buttons: [
        { text: 'הזמנה', payload: 'order' },
        { text: 'מידע', payload: 'info' },
      ],
    },
  },
  {
    id: '2',
    type: 'message',
    position: { x: 50, y: 200 },
    data: {
      messageType: 'message_regular',
      label: 'הנה טופס הזמנה...',
    },
  },
  {
    id: '3',
    type: 'action',
    position: { x: 350, y: 200 },
    data: { actionType: 'transfer', actionLabel: 'שיוך לנציג', label: 'מעביר אותך לנציג' },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    type: 'straight',
    source: '1',
    target: '2',
    sourceHandle: 'order',
    targetHandle: 'target',
    markerEnd: { type: MarkerType.ArrowClosed },
    label: 'הזמנה',
    labelStyle: { fill: '#1e293b', fontWeight: 600 },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
    labelBgPadding: [4, 8],
    labelBgBorderRadius: 4,
    style: { stroke: '#2e6155', strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    type: 'straight',
    source: '1',
    target: '3',
    sourceHandle: 'info',
    targetHandle: 'target',
    markerEnd: { type: MarkerType.ArrowClosed },
    label: 'מידע',
    labelStyle: { fill: '#1e293b', fontWeight: 600 },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
    labelBgPadding: [4, 8],
    labelBgBorderRadius: 4,
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
];

const BOT_FLOW_STORAGE_KEY = 'gambot_bot_flow';

let nodeId = 4;
const getId = () => `node_${nodeId++}`;

const BotFlowBuilderInner = ({ mode, onSave, initialFlow, nodes, setNodes, edges, setEdges, onNodesChange, onEdgesChange }) => {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const { t } = useBotFlowLang();
  const TRIGGER_TYPES = getTriggerTypes(t);
  const ACTION_TYPES = getActionTypes(t);
  const updateNodeInternals = useUpdateNodeInternals();
  const appliedInitialRef = React.useRef(false);

  const selectedNode = nodes.find((n) => n.selected);
  const hasButtons =
    selectedNode &&
    ((selectedNode.type === 'trigger' && selectedNode.data?.triggerType === 'trigger_button') ||
      (selectedNode.type === 'message' && selectedNode.data?.messageType === 'message_template'));
  React.useEffect(() => {
    if (initialFlow && !appliedInitialRef.current && (initialFlow.nodes?.length || initialFlow.edges?.length)) {
      appliedInitialRef.current = true;
      if (initialFlow.nodes?.length) setNodes(initialFlow.nodes);
      if (initialFlow.edges?.length) setEdges(initialFlow.edges);
      setTimeout(() => {
        (initialFlow.nodes || []).forEach((n) => updateNodeInternals(n.id));
      }, 100);
    }
  }, [initialFlow, updateNodeInternals, setNodes, setEdges]);


  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const sourceHandle = params.sourceHandle;
      const buttons = sourceNode?.data?.buttons || [];
      const buttonLabel = buttons.find((b) => (b.payload || b.text) === sourceHandle)?.text || sourceHandle;
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'straight',
            label: buttonLabel,
            labelStyle: { fill: '#1e293b', fontWeight: 600 },
            labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
            labelBgPadding: [4, 8],
            labelBgBorderRadius: 4,
            style: { stroke: '#2e6155', strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [nodes, setEdges]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const dropType = e.dataTransfer.getData('application/botflow-type');
      const dropPayload = e.dataTransfer.getData('application/botflow-payload');
      if (!dropType) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      if (dropType === 'trigger') {
        const info = TRIGGER_TYPES.find((tr) => tr.type === dropPayload) || TRIGGER_TYPES[0];
        const isButton = dropPayload === 'trigger_button';
        const isWebhook = dropPayload === 'trigger_webhook';
        const isNewUser = dropPayload === 'trigger_new_user';
        const label = isButton ? t.defaults.triggerButton : isWebhook ? t.defaults.triggerWebhook : isNewUser ? t.defaults.triggerNewUser : t.defaults.triggerRegular;
        const newNode = {
          id: getId(),
          type: 'trigger',
          position,
          data: {
            triggerType: dropPayload,
            label,
            buttons: isButton ? [{ text: `${t.defaults.buttonN} 1`, payload: 'btn1' }] : [],
          },
        };
        setNodes((nds) => nds.concat(newNode));
      } else if (dropType === 'message') {
        const isTemplate = dropPayload === 'message_template';
        const isAi = dropPayload === 'message_ai';
        const isMediaDrop = dropPayload === 'message_media';
        const label = isAi ? t.defaults.msgAi : isTemplate ? t.defaults.msgTemplate : isMediaDrop ? t.defaults.msgMedia : t.defaults.msgRegular;
        const newNode = {
          id: getId(),
          type: 'message',
          position,
          data: {
            messageType: dropPayload,
            label,
            buttons: isTemplate ? [{ text: `${t.defaults.buttonN} 1`, payload: 'btn1' }] : [],
          },
        };
        setNodes((nds) => nds.concat(newNode));
      } else {
        const actionInfo = ACTION_TYPES.find((a) => a.type === dropPayload) || ACTION_TYPES[0];
        const newNode = {
          id: getId(),
          type: 'action',
          position,
          data: {
            actionType: dropPayload,
            actionLabel: actionInfo.label,
            label: '',
          },
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [screenToFlowPosition, setNodes, t]
  );

  const onPaletteDragStart = (e, type, payload) => {
    e.dataTransfer.setData('application/botflow-type', type);
    e.dataTransfer.setData('application/botflow-payload', payload);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = useCallback((type, payload) => {
    const position = { x: 250, y: nodes.length * 120 };
    let newNode;
    if (type === 'trigger') {
      const isButton = payload === 'trigger_button';
      const isWebhook = payload === 'trigger_webhook';
      const isNewUser = payload === 'trigger_new_user';
      const label = isButton ? t.defaults.triggerButton : isWebhook ? t.defaults.triggerWebhook : isNewUser ? t.defaults.triggerNewUser : t.defaults.triggerRegular;
      newNode = {
        id: getId(),
        type: 'trigger',
        position,
        data: {
          triggerType: payload,
          label,
          buttons: isButton ? [{ text: `${t.defaults.buttonN} 1`, payload: 'btn1' }] : [],
        },
      };
    } else if (type === 'message') {
      const isTemplate = payload === 'message_template';
      const isAi = payload === 'message_ai';
      const isMediaAdd = payload === 'message_media';
      const label = isAi ? t.defaults.msgAi : isTemplate ? t.defaults.msgTemplate : isMediaAdd ? t.defaults.msgMedia : t.defaults.msgRegular;
      newNode = {
        id: getId(),
        type: 'message',
        position,
        data: {
          messageType: payload,
          label,
          buttons: isTemplate ? [{ text: `${t.defaults.buttonN} 1`, payload: 'btn1' }] : [],
        },
      };
    } else {
      const actionInfo = ACTION_TYPES.find((a) => a.type === payload) || ACTION_TYPES[0];
      newNode = {
        id: getId(),
        type: 'action',
        position,
        data: { actionType: payload, actionLabel: actionInfo.label, label: '' },
      };
    }
    setNodes((nds) => nds.concat(newNode));
  }, [nodes.length, setNodes, t]);

  const handleSaveToStorage = useCallback(() => {
    const flow = { nodes, edges };
    try {
      localStorage.setItem(BOT_FLOW_STORAGE_KEY, JSON.stringify(flow));
      return true;
    } catch (err) {
      console.error('Failed to save flow:', err);
      return false;
    }
  }, [nodes, edges]);

  const handleLoadFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(BOT_FLOW_STORAGE_KEY);
      if (saved) {
        const flow = JSON.parse(saved);
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        return true;
      }
    } catch (err) {
      console.error('Failed to load flow:', err);
    }
    return false;
  }, [setNodes, setEdges]);

  const handleLoadFromFile = useCallback((e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const flow = JSON.parse(ev.target?.result || '{}');
        const nodes = flow.nodes || flow.Nodes;
        const edges = flow.edges || flow.Edges;
        if (nodes?.length) setNodes(Array.isArray(nodes) ? nodes : []);
        if (edges?.length) {
          const normalized = (Array.isArray(edges) ? edges : []).map((ed) => ({ ...ed, type: 'straight' }));
          setEdges(normalized);
        }
      } catch (err) {
        console.error('Failed to parse flow file:', err);
        alert(t.errors.fileParse);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [setNodes, setEdges, t]);

  const handleAddButton = useCallback(() => {
    if (!selectedNode || !hasButtons) return;
    const buttons = [...(selectedNode.data?.buttons || []), { text: `${t.defaults.buttonN} ${(selectedNode.data?.buttons?.length || 0) + 1}`, payload: `btn${Date.now()}` }];
    setNodes((nds) =>
      nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons } } : n))
    );
    setTimeout(() => updateNodeInternals(selectedNode.id), 50);
  }, [selectedNode, hasButtons, setNodes, updateNodeInternals, t]);

  const handleRemoveButton = useCallback(
    (index) => {
      if (!selectedNode || !hasButtons) return;
      const buttons = (selectedNode.data?.buttons || []).filter((_, i) => i !== index);
      setNodes((nds) =>
        nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons } } : n))
      );
      setTimeout(() => updateNodeInternals(selectedNode.id), 50);
    },
    [selectedNode, hasButtons, setNodes, updateNodeInternals]
  );

  const handleUpdateButtonText = useCallback(
    (index, text) => {
      if (!selectedNode || !hasButtons) return;
      const buttons = (selectedNode.data?.buttons || []).map((b, i) =>
        i === index ? { ...b, text: text || b.text } : b
      );
      setNodes((nds) =>
        nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons } } : n))
      );
    },
    [selectedNode, hasButtons, setNodes]
  );

  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
  }, [selectedNode, setNodes, setEdges]);

  const handleDownload = useCallback(() => {
    const flow = { nodes, edges, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gambot-bot-flow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleDownloadImage = useCallback(async () => {
    const viewport = document.querySelector('.bot-flow-canvas .react-flow__viewport');
    if (!viewport) return;
    try {
      fitView({ padding: 0.2, duration: 200 });
      await new Promise((r) => setTimeout(r, 300));
      const dataUrl = await toPng(viewport, {
        backgroundColor: '#f8fafc',
        style: { transform: 'translate(0,0) scale(1)' },
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `gambot-bot-flow-${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.error('Image export failed:', err);
      alert(t.errors.imageExport);
    }
  }, [fitView, t]);

  const handleDownloadPdf = useCallback(async () => {
    const viewport = document.querySelector('.bot-flow-canvas .react-flow__viewport');
    if (!viewport) return;
    try {
      fitView({ padding: 0.2, duration: 200 });
      await new Promise((r) => setTimeout(r, 300));
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .set({
          margin: 10,
          filename: `gambot-bot-flow-${Date.now()}.pdf`,
          image: { type: 'png', quality: 1 },
          html2canvas: { scale: 2, useCORS: true },
        })
        .from(viewport)
        .save();
    } catch (err) {
      console.error('PDF export failed:', err);
      alert(t.errors.pdfExport);
    }
  }, [fitView, t]);

  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [emailConsent, setEmailConsent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEmailToSelf = useCallback(
    async (e) => {
      e?.preventDefault();
      const email = (emailValue || '').trim();
      if (!email) {
        setEmailError(t.emailModal.errorEmail);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError(t.emailModal.errorEmailInvalid);
        return;
      }
      if (!emailConsent) {
        setEmailError(t.emailModal.errorConsent);
        return;
      }
      setEmailError('');
      setEmailSending(true);
      try {
        const flow = { nodes, edges, exportedAt: new Date().toISOString() };
        const res = await fetch(BOT_FLOW_EXPORT_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, flowData: flow }),
        });
        if (res.ok || res.status === 202) {
          setShowEmailModal(false);
          setEmailValue('');
          setEmailConsent(false);
          alert(t.emailModal.success);
        } else {
          const errData = await res.json().catch(() => ({}));
          setEmailError(errData?.message || errData?.Message || t.emailModal.errorSend);
        }
      } catch (err) {
        setEmailError(t.emailModal.errorConnection);
      } finally {
        setEmailSending(false);
      }
    },
    [nodes, edges, emailValue, emailConsent, t]
  );

  return (
    <>
      <div className="bot-flow-palette">
        {/* Tutorial video badge */}
        <button
          type="button"
          className="guide-video-btn guide-video-btn--badge"
          style={{ width: '100%', marginBottom: '10px', justifyContent: 'center' }}
          onClick={() => setShowTutorialModal(true)}
          title={t.panel.tutorial}
        >
          <span style={{ fontSize: '14px', marginInlineEnd: '6px' }}>▶</span>
          {t.panel.tutorial}
        </button>

        <div className="bot-flow-palette-title">{t.palette.triggers}</div>
        {TRIGGER_TYPES.map((t) => (
          <div
            key={t.type}
            className="bot-flow-palette-item"
            draggable
            onDragStart={(e) => onPaletteDragStart(e, 'trigger', t.type)}
            style={{ borderColor: t.color }}
          >
            <span className="bot-flow-palette-icon">{t.icon}</span>
            {t.label}
          </div>
        ))}

        <div className="bot-flow-palette-title">{t.palette.sentMessages}</div>
        {ACTION_TYPES.filter((a) => a.type === 'message_regular' || a.type === 'message_template' || a.type === 'message_ai' || a.type === 'message_media').map((action) => (
          <div
            key={action.type}
            className="bot-flow-palette-item"
            draggable
            onDragStart={(e) => onPaletteDragStart(e, 'message', action.type)}
            style={{ borderColor: action.color }}
          >
            <span className="bot-flow-palette-icon">{action.icon}</span>
            {action.label}
          </div>
        ))}

        <div className="bot-flow-palette-title">{t.palette.actions}</div>
        {ACTION_TYPES.filter((a) => a.type !== 'message_regular' && a.type !== 'message_template' && a.type !== 'message_ai' && a.type !== 'message_media').map((action) => (
          <div
            key={action.type}
            className="bot-flow-palette-item"
            draggable
            onDragStart={(e) => onPaletteDragStart(e, 'action', action.type)}
            style={{ borderColor: action.color }}
          >
            <span className="bot-flow-palette-icon">{action.icon}</span>
            {action.label}
          </div>
        ))}
      </div>

      {hasButtons && (
        <Panel position="bottom-left" className="bot-flow-properties-panel">
          <div className="bot-flow-properties-title">{t.panel.buttons}</div>
              {(selectedNode?.data?.buttons || []).map((btn, i) => (
                <div key={i} className="bot-flow-properties-button-row">
                  <input
                    type="text"
                    value={btn.text || ''}
                    onChange={(e) => handleUpdateButtonText(i, e.target.value)}
                    placeholder={t.messages.buttonText}
                    className="bot-flow-properties-input"
                  />
                  <button
                    type="button"
                    className="bot-flow-properties-remove"
                    onClick={() => handleRemoveButton(i)}
                    title={t.messages.removeButton}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" className="bot-flow-properties-add-btn" onClick={handleAddButton}>
                {t.messages.addButton}
              </button>
        </Panel>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        className="bot-flow-canvas"
        connectionLineType={ConnectionLineType.Straight}
        connectionRadius={30}
        snapToGrid
        snapGrid={[10, 10]}
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={{
          type: 'straight',
          markerEnd: { type: MarkerType.ArrowClosed },
          labelStyle: { fill: '#1e293b', fontWeight: 600 },
          labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
          labelBgPadding: [4, 8],
          labelBgBorderRadius: 4,
          style: { stroke: '#2e6155', strokeWidth: 2 },
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right" className="bot-flow-panel">
          {selectedNode && (
            <button
              type="button"
              className="bot-flow-btn bot-flow-btn-delete"
              onClick={handleDeleteNode}
              title={t.messages.deleteNodeTitle}
            >
              {t.messages.deleteNode}
            </button>
          )}
          <button type="button" className="bot-flow-btn bot-flow-btn-save" onClick={handleSaveToStorage}>
            {t.panel.save}
          </button>
          <button type="button" className="bot-flow-btn bot-flow-btn-load" onClick={handleLoadFromStorage}>
            {t.panel.load}
          </button>
          {mode === 'website' && (
            <>
              <label className="bot-flow-btn bot-flow-btn-load" style={{ margin: 0, cursor: 'pointer' }}>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleLoadFromFile}
                  style={{ display: 'none' }}
                />
                {t.panel.loadFile}
              </label>
              <button type="button" className="bot-flow-btn bot-flow-btn-download" onClick={handleDownload}>
                {t.panel.download}
              </button>
              <button type="button" className="bot-flow-btn bot-flow-btn-download" onClick={handleDownloadImage} title={t.panel.downloadImageTitle}>
                {t.panel.downloadImage}
              </button>
              <button type="button" className="bot-flow-btn bot-flow-btn-download" onClick={handleDownloadPdf} title={t.panel.downloadPdfTitle}>
                {t.panel.downloadPdf}
              </button>
              <button
                type="button"
                className="bot-flow-btn bot-flow-btn-email"
                onClick={() => setShowEmailModal(true)}
              >
                {t.panel.sendEmail}
              </button>
            </>
          )}
          {mode === 'dashboard' && onSave && (
            <button
              type="button"
              className="bot-flow-btn bot-flow-btn-convert"
              onClick={() => onSave({ nodes, edges })}
            >
              {t.panel.convert}
            </button>
          )}
        </Panel>
      </ReactFlow>

      {showTutorialModal && createPortal(
        <div className="guide-video-modal-overlay" onClick={() => setShowTutorialModal(false)}>
          <div
            className="guide-video-modal-content"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <button
              type="button"
              className="gvb-modal-close"
              onClick={() => setShowTutorialModal(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="gvb-modal-header">
              <span style={{ fontSize: '18px', marginInlineEnd: '8px' }}>▶</span>
              <h3>{t.panel.tutorialTitle}</h3>
            </div>
            <div className="guide-video-container">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/zLzrD6Tpt30?start=8"
                title={t.panel.tutorialTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {mode === 'website' && showEmailModal && (
        <div className="bot-flow-email-modal-overlay" onClick={() => !emailSending && setShowEmailModal(false)}>
          <div className="bot-flow-email-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="bot-flow-email-modal-title">{t.emailModal.title}</h3>
            <p className="bot-flow-email-modal-desc">{t.emailModal.desc}</p>
            <form onSubmit={handleEmailToSelf}>
              <input
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder={t.emailModal.placeholder}
                className="bot-flow-email-modal-input"
                disabled={emailSending}
                dir="ltr"
              />
              <label className="bot-flow-email-modal-checkbox">
                <input
                  type="checkbox"
                  checked={emailConsent}
                  onChange={(e) => setEmailConsent(e.target.checked)}
                  disabled={emailSending}
                />
                <span>{t.emailModal.consent}</span>
              </label>
              {emailError && <p className="bot-flow-email-modal-error">{emailError}</p>}
              <div className="bot-flow-email-modal-actions">
                <button
                  type="button"
                  className="bot-flow-btn bot-flow-btn-load"
                  onClick={() => !emailSending && setShowEmailModal(false)}
                  disabled={emailSending}
                >
                  {t.emailModal.cancel}
                </button>
                <button
                  type="submit"
                  className="bot-flow-btn bot-flow-btn-save"
                  disabled={emailSending}
                >
                  {emailSending ? t.emailModal.sending : t.emailModal.send}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * BotFlowBuilder - קומפוננטה משותפת לעורך בוטים ויזואלי
 * lang: 'he' | 'en' - from route /bot-builder (he) or /en/bot-builder (en)
 */
const BotFlowBuilder = (props) => {
  const lang = props.lang || 'he';
  const t = getBotFlowT(lang);
  const dir = lang === 'he' ? 'rtl' : 'ltr';

  const [nodes, setNodes, onNodesChange] = useNodesState(
    props.initialFlow?.nodes ?? initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    props.initialFlow?.edges ?? initialEdges
  );

  return (
    <BotFlowLangContext.Provider value={{ lang, t }}>
      <ReactFlowProvider>
        <div className="bot-flow-builder" dir={dir}>
          <BotFlowBuilderInner
            {...props}
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
          />
        </div>
      </ReactFlowProvider>
    </BotFlowLangContext.Provider>
  );
};

export default BotFlowBuilder;
