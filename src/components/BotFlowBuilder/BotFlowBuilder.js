import React, { useCallback, useState, useEffect } from 'react';
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
  useStoreApi,
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './BotFlowBuilder.css';
import { getBotFlowT } from './translations';
import { BotFlowLangContext, useBotFlowLang } from './BotFlowLangContext';

// API for email export
const BOT_FLOW_EXPORT_API =
  process.env.NEXT_PUBLIC_BOT_FLOW_EXPORT_API || process.env.REACT_APP_BOT_FLOW_EXPORT_API ||
  'https://gambot.azurewebsites.net/api/BotFlow/ExportToEmail';
// Base URL for API
const BOT_FLOW_API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL ||
  (typeof URL !== 'undefined' ? new URL(BOT_FLOW_EXPORT_API).origin : 'https://gambot.azurewebsites.net');

const getTriggerTypes = (t) => [
  { type: 'trigger_regular', label: t.triggers.regular, icon: '📩', color: '#059669' },
  { type: 'trigger_reply', label: t.triggers.reply, icon: '↩️', color: '#0d9488' },
  { type: 'trigger_button', label: t.triggers.button, icon: '🔘', color: '#0891b2' },
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
  { type: 'create_task', label: t.actions.create_task, icon: '✅', color: '#16a34a' },
  { type: 'distribute_leads', label: t.actions.distribute_leads, icon: '⚖️', color: '#f59e0b' },
  { type: 'response_task_router', label: t.actions.response_task_router, icon: '⏰', color: '#7c3aed' },
  { type: 'delay', label: t.actions.delay || 'השהייה', icon: '⏱️', color: '#64748b' },
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
  const isReply = data?.triggerType === 'trigger_reply';
  const triggerInfo = TRIGGER_TYPES.find((tr) => tr.type === data?.triggerType) || TRIGGER_TYPES[0];
  const defaultLabel = isButton ? t.triggerDefaults.button : isWebhook ? t.triggerDefaults.webhook : isNewUser ? t.triggerDefaults.newUser : isReply ? t.triggerDefaults.reply : t.triggerDefaults.regular;

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
      className={`bot-flow-trigger-node ${selected ? 'selected' : ''} ${isReply ? 'bot-flow-trigger-midflow' : ''}`}
      style={{ borderRightColor: triggerInfo.color }}
    >
      {/* Reply trigger can be placed mid-flow (has target handle) */}
      {isReply && (
        <Handle type="target" position={Position.Left} id="target" className="bot-flow-handle" />
      )}
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
        <div className="bot-flow-incoming-preview">
          {/* Template header media for trigger_button */}
          {isButton && data?.templateHeaderType && data.templateHeaderType !== 'NONE' && data.templateHeaderType !== 'TEXT' && (
            <div className="bot-flow-preview-media">
              {(data.templateHeaderMedia || mediaUrl) ? (
                data.templateHeaderType === 'IMAGE' ? (
                  <img src={data.templateHeaderMedia || mediaUrl} alt="" />
                ) : (
                  <div className="bot-flow-preview-media-placeholder">
                    {data.templateHeaderType === 'VIDEO' ? '🎬 Video' : data.templateHeaderType === 'DOCUMENT' ? '📄 Document' : '📍 Location'}
                  </div>
                )
              ) : (
                <div className="bot-flow-preview-media-placeholder" style={{ opacity: 0.6 }}>
                  {data.templateHeaderType === 'IMAGE' ? '🖼️ Header Image' : data.templateHeaderType === 'VIDEO' ? '🎬 Header Video' : data.templateHeaderType === 'DOCUMENT' ? '📄 Header Document' : '📍 Location'}
                </div>
              )}
            </div>
          )}
          {isButton && data?.templateHeaderType === 'TEXT' && data?.templateHeader && (
            <div className="bot-flow-wa-header">{data.templateHeader}</div>
          )}
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
          {/* Footer */}
          {data?.templateFooter && (
            <div className="bot-flow-wa-footer">{data.templateFooter}</div>
          )}
          {/* WhatsApp-style timestamp */}
          <div className="bot-flow-wa-timestamp">
            <span>10:30</span>
          </div>
          {/* WhatsApp-style buttons for button-type trigger */}
          {isButton && buttons.length > 0 && (
            <div className="bot-flow-wa-buttons">
              {buttons.map((btn, i) => (
                <div key={i} className="bot-flow-wa-button-row">
                  <div className="bot-flow-wa-button">
                    <span>↩</span>
                    {btn.text || t.defaults.button}
                  </div>
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
          <button type="button" className="bot-flow-edit-trigger nodrag" onClick={handleEdit} title={t.messages.edit}>
            ✎
          </button>
        </div>
      )}
      {/* Button editor moved to settings panel */}
      {/* When not a button-type, or button-type but no buttons yet — show plain handle */}
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
  const { t, lang, organization } = useBotFlowLang();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');
  const [mediaUploading, setMediaUploading] = React.useState(false);
  const [pendingMediaFile, setPendingMediaFile] = React.useState(null);
  const [pendingMediaDataUrl, setPendingMediaDataUrl] = React.useState(null);
  const [pendingMediaType, setPendingMediaType] = React.useState(null);
  const [pendingMediaRemoved, setPendingMediaRemoved] = React.useState(false);
  const fileInputRef = React.useRef(null);
  // Media library picker
  const [showMediaPicker, setShowMediaPicker] = React.useState(false);
  // Template picker
  const [showTemplatePicker, setShowTemplatePicker] = React.useState(false);
  const [templateList, setTemplateList] = React.useState([]);
  const [templatesLoading, setTemplatesLoading] = React.useState(false);

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
    } else if (pendingMediaDataUrl && !pendingMediaDataUrl.startsWith('data:')) {
      // URL from media library - already uploaded, use directly
      finalMediaUrl = pendingMediaDataUrl;
      finalMediaType = pendingMediaType || 'image';
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
    setShowTemplatePicker(false);
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

  const handleLibrarySelect = (file) => {
    const ft = (file.fileType || '').toLowerCase();
    const type = ft.startsWith('image') ? 'image' : ft.startsWith('video') ? 'video' : 'document';
    setPendingMediaRemoved(false);
    setPendingMediaFile(null);
    setPendingMediaDataUrl(file.url || file.downloadUrl || '');
    setPendingMediaType(type);
    setShowMediaPicker(false);
  };

  const handleRemoveMedia = () => {
    setPendingMediaFile(null);
    setPendingMediaDataUrl(null);
    setPendingMediaType(null);
    setPendingMediaRemoved(!!mediaUrl);
  };

  const handleOpenTemplatePicker = async () => {
    setShowTemplatePicker(true);
    if (templateList.length === 0 && organization) {
      setTemplatesLoading(true);
      try {
        const res = await fetch(`${BOT_FLOW_API_BASE}/api/Webhooks/GetAllTemplates`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ organization }) });
        const resData = await res.json();
        const approved = (Array.isArray(resData) ? resData : []).filter(t => t.status === 'APPROVED');
        setTemplateList(approved);
      } catch (err) {
        console.error('Error fetching templates:', err);
      } finally {
        setTemplatesLoading(false);
      }
    }
  };

  const handleSelectTemplate = async (tmpl) => {
    if (!organization) return;
    try {
      const res = await fetch(`${BOT_FLOW_API_BASE}/api/Webhooks/GetTemplateById`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ organizationId: organization, templateId: tmpl.Id }) });
      const detail = await res.json();
      const headerComp = (detail.components || []).find(c => c.type === 'HEADER');
      const bodyComp = (detail.components || []).find(c => c.type === 'BODY');
      const footerComp = (detail.components || []).find(c => c.type === 'FOOTER');
      const btnComp = (detail.components || []).find(c => c.type === 'BUTTONS');
      const newButtons = (btnComp?.buttons || []).map((b, i) => ({
        text: b.text,
        payload: b.text || `btn-${i}`,
        type: b.type || 'QUICK_REPLY',
        ...(b.type === 'URL' && { url: b.url || '', urlType: b.example ? 'DYNAMIC' : 'STATIC' }),
        ...(b.type === 'PHONE_NUMBER' && { phone_number: b.phone_number || '' }),
      }));
      if (bodyComp?.text) setEditValue(bodyComp.text);
      const headerFormat = (headerComp?.format || '').toUpperCase();
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? {
                ...n,
                data: {
                  ...n.data,
                  buttons: newButtons,
                  templateName: tmpl.name,
                  templateHeader: headerComp?.text || '',
                  templateHeaderType: headerFormat || 'NONE',
                  templateHeaderMedia: '',
                  templateFooter: footerComp?.text || '',
                },
              }
            : n
        )
      );
    } catch (err) {
      console.error('Error fetching template detail:', err);
    }
    setShowTemplatePicker(false);
  };

  const previewMediaUrl = pendingMediaDataUrl || (pendingMediaRemoved ? null : mediaUrl);
  const previewMediaType = pendingMediaType || mediaType;
  const [isEditingLabel, setIsEditingLabel] = React.useState(false);
  const [labelEditValue, setLabelEditValue] = React.useState('');
  const nodeTag = data?.nodeTag || '';

  return (
    <div className={`bot-flow-message-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} id="target" className="bot-flow-handle" />
      {/* Editable node label/tag */}
      {isEditingLabel ? (
        <div className="bot-flow-node-tag-edit nodrag">
          <input
            type="text"
            className="bot-flow-node-tag-input"
            value={labelEditValue}
            onChange={(e) => setLabelEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, nodeTag: labelEditValue.trim() } } : n));
                setIsEditingLabel(false);
              }
              if (e.key === 'Escape') setIsEditingLabel(false);
            }}
            onBlur={() => {
              setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, nodeTag: labelEditValue.trim() } } : n));
              setIsEditingLabel(false);
            }}
            autoFocus
            placeholder={lang === 'he' ? 'תיאור (לדוגמה: הודעת פתיחה)' : 'Label (e.g. Welcome message)'}
          />
        </div>
      ) : (
        <div
          className={`bot-flow-node-tag ${nodeTag ? 'has-tag' : ''}`}
          onClick={() => { setLabelEditValue(nodeTag); setIsEditingLabel(true); }}
          title={lang === 'he' ? 'לחץ להוספת תיאור' : 'Click to add label'}
        >
          {nodeTag || (lang === 'he' ? '+ תיאור' : '+ Label')}
        </div>
      )}
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
                  <div className="bot-flow-media-btn-row">
                    <label className="bot-flow-media-upload-btn nodrag" style={{ borderColor: '#0891b2', color: '#0891b2' }}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                        onChange={handleMediaSelect}
                        style={{ display: 'none' }}
                      />
                      📱 ממכשיר
                    </label>
                    {organization && (
                      <button type="button" className="bot-flow-media-upload-btn nodrag" style={{ borderColor: '#0891b2', color: '#0891b2' }} onClick={() => setShowMediaPicker(true)}>
                        🗂️ מהספרייה
                      </button>
                    )}
                  </div>
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
              {isTemplate ? (
                <>
                  {organization && (
                    <div style={{ marginBottom: 6 }}>
                      <button
                        type="button"
                        className="bot-flow-pick-template-btn nodrag"
                        onClick={handleOpenTemplatePicker}
                      >
                        📋 {lang === 'he' ? 'בחר מתבנית קיימת' : 'Pick from templates'}
                      </button>
                      {showTemplatePicker && createPortal(
                        <div className="bot-flow-template-picker-overlay" onClick={() => setShowTemplatePicker(false)}>
                          <div className="bot-flow-template-picker" onClick={e => e.stopPropagation()}>
                            <div className="bot-flow-template-picker-header">
                              <strong>{lang === 'he' ? 'בחר תבנית WhatsApp' : 'Pick WhatsApp Template'}</strong>
                              <button type="button" onClick={() => setShowTemplatePicker(false)}>✕</button>
                            </div>
                            <div className="bot-flow-template-picker-list">
                              {templatesLoading && <div className="bot-flow-template-picker-empty">{lang === 'he' ? 'טוען תבניות...' : 'Loading templates...'}</div>}
                              {!templatesLoading && templateList.length === 0 && (
                                <div className="bot-flow-template-picker-empty">{lang === 'he' ? 'אין תבניות מאושרות' : 'No approved templates'}</div>
                              )}
                              {templateList.map(tmpl => {
                                const comps = tmpl.components || [];
                                const hasBtn = comps.some(c => c.type === 'BUTTONS');
                                const hasFooter = comps.some(c => c.type === 'FOOTER');
                                return (
                                  <div
                                    key={tmpl.Id || tmpl.id}
                                    className="bot-flow-template-picker-item"
                                    onClick={() => handleSelectTemplate(tmpl)}
                                  >
                                    <span className="bot-flow-template-picker-name">{tmpl.name}</span>
                                    <span className="bot-flow-template-picker-tags">
                                      {hasBtn && <span className="bot-flow-template-picker-tag">🔘</span>}
                                      {hasFooter && <span className="bot-flow-template-picker-tag">📎</span>}
                                    </span>
                                    <span className="bot-flow-template-picker-badge">APPROVED</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>,
                        document.body
                      )}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#64748b', textAlign: 'center', padding: '4px 0' }}>
                    {lang === 'he' ? '✏️ עריכת טקסט, לחצנים ו-footer → בפאנל הצדדי' : '✏️ Edit text, buttons & footer → in side panel'}
                  </div>
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
                </>
              )}
              {!isTemplate && hasMediaSupport && (
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
                    <div className="bot-flow-media-btn-row">
                      <label className="bot-flow-media-upload-btn nodrag">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                          onChange={handleMediaSelect}
                          style={{ display: 'none' }}
                        />
                        📱 ממכשיר
                      </label>
                      {organization && (
                        <button type="button" className="bot-flow-media-upload-btn nodrag" onClick={() => setShowMediaPicker(true)}>
                          🗂️ מהספרייה
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {/* MediaPickerModal not available on website - media library only in personal area */}
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
          {/* Template name + category badge */}
          {isTemplate && data?.templateName && (
            <div className="bot-flow-wa-template-badge">📋 {data.templateName}</div>
          )}
          {isTemplate && (
            <div className="bot-flow-wa-template-badge" style={{ background: (data?.templateCategory || 'MARKETING') === 'MARKETING' ? '#fef3c7' : '#dbeafe', color: (data?.templateCategory || 'MARKETING') === 'MARKETING' ? '#92400e' : '#1e40af', fontSize: 10, padding: '2px 8px' }}>
              {(data?.templateCategory || 'MARKETING') === 'MARKETING' ? '📢 שיווק' : '🔧 שירות'}
            </div>
          )}
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
          {/* Template header */}
          {isTemplate && data?.templateHeaderType && data.templateHeaderType !== 'NONE' && data.templateHeaderType !== 'TEXT' && (
            <div className="bot-flow-preview-media">
              {data.templateHeaderMedia ? (
                data.templateHeaderType === 'IMAGE' ? (
                  <img src={data.templateHeaderMedia} alt="" />
                ) : (
                  <div className="bot-flow-preview-media-placeholder">
                    {data.templateHeaderType === 'VIDEO' ? '🎬 Video' : data.templateHeaderType === 'DOCUMENT' ? '📄 Document' : '📍 Location'}
                  </div>
                )
              ) : (
                <div className="bot-flow-preview-media-placeholder" style={{ opacity: 0.6 }}>
                  {data.templateHeaderType === 'IMAGE' ? '🖼️ Header Image' : data.templateHeaderType === 'VIDEO' ? '🎬 Header Video' : data.templateHeaderType === 'DOCUMENT' ? '📄 Header Document' : '📍 Location'}
                </div>
              )}
            </div>
          )}
          {isTemplate && data?.templateHeaderType === 'TEXT' && data?.templateHeader && (
            <div className="bot-flow-wa-header">{data.templateHeader}</div>
          )}
          {/* Regular/template: always show text. Media: show caption only if present */}
          {!isMedia ? (
            <div className={`bot-flow-preview-caption ${!content ? 'bot-flow-preview-placeholder' : ''}`}>
              {content || t.messages.addText}
            </div>
          ) : content ? (
            <div className="bot-flow-preview-caption">{content}</div>
          ) : null}
          {/* Template footer */}
          {isTemplate && data?.templateFooter && (
            <div className="bot-flow-wa-footer">{data.templateFooter}</div>
          )}
          {/* WhatsApp-style timestamp + double-tick */}
          <div className="bot-flow-wa-timestamp">
            <span>10:30</span>
            <span className="bot-flow-wa-timestamp-ticks">✓✓</span>
          </div>
          {/* WhatsApp-style quick-reply buttons */}
          {isTemplate && buttons.length > 0 && (
            <div className="bot-flow-wa-buttons">
              {buttons.map((btn, i) => (
                <div key={i} className="bot-flow-wa-button-row">
                  <div className={`bot-flow-wa-button ${btn.type === 'URL' ? 'bot-flow-wa-button-url' : btn.type === 'PHONE_NUMBER' ? 'bot-flow-wa-button-phone' : ''}`}>
                    <span>{btn.type === 'URL' ? '🔗' : btn.type === 'PHONE_NUMBER' ? '📞' : '↩'}</span>
                    {btn.text || t.defaults.button}
                  </div>
                  {/* Only QUICK_REPLY buttons get source handles for branching */}
                  {(!btn.type || btn.type === 'QUICK_REPLY') && (
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={btn.payload || `btn-${i}`}
                      className="bot-flow-handle bot-flow-handle-in-button"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <button type="button" className="bot-flow-edit-trigger nodrag" onClick={handleEdit} title={isTemplate ? (lang === 'he' ? 'בחר תבנית' : 'Pick template') : t.messages.edit}>
            {isTemplate ? '📋' : '✎'}
          </button>
        </div>
      )}
      {/* Button editor moved to settings panel */}
      {/* Source handle: show only when no per-button handles */}
      {(!isTemplate || buttons.filter(b => !b.type || b.type === 'QUICK_REPLY').length === 0) ? (
        <Handle type="source" position={Position.Right} id="default" className="bot-flow-handle" />
      ) : null}
    </div>
  );
};

// Configurable action types - edit inline on the node when selected
const CONFIGURABLE_ACTIONS = ['transfer', 'change_owner', 'status', 'update_category', 'update_contact_tags', 'create_task', 'distribute_leads', 'response_task_router', 'delay'];

// Custom node for action - different types, config edit inline on the component
const ActionNode = ({ id, data, selected }) => {
  const { setNodes } = useReactFlow();
  const { t, lang, organization } = useBotFlowLang();
  const ACTION_TYPES = getActionTypes(t);
  const actionInfo = ACTION_TYPES.find((a) => a.type === data?.actionType) || ACTION_TYPES[0];
  const config = data?.config || {};
  const isConfigurable = CONFIGURABLE_ACTIONS.includes(data?.actionType);
  const [orgUsers, setOrgUsers] = React.useState([]);
  const usersLoadedRef = React.useRef(false);

  React.useEffect(() => {
    if (selected && (data?.actionType === 'transfer' || data?.actionType === 'change_owner') && organization && !usersLoadedRef.current) {
      usersLoadedRef.current = true;
      fetch(`${BOT_FLOW_API_BASE}/api/Webhooks/GetAllUsersByOrg`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ organization }) })
        .then(res => res.json())
        .then(resData => {
          const users = Array.isArray(resData) ? resData : (resData?.users || []);
          const systemUsers = [
            { uID: 'gambot', UserName: 'Gambot', Email: 'system' },
            { uID: 'gambot-ai', UserName: 'Gambot AI', Email: 'system' },
          ];
          setOrgUsers([...systemUsers, ...users]);
        })
        .catch(() => setOrgUsers([]));
    }
  }, [selected, data?.actionType, organization]);

  let summary = data?.label || '';
  if (!summary && isConfigurable) {
    if (data?.actionType === 'transfer' && config?.agentName) summary = config.agentName;
    else if (data?.actionType === 'change_owner' && config?.ownerName) summary = config.ownerName;
    else if (data?.actionType === 'status' && config?.status) {
      const opt = (t.statusOptions || []).find((o) => o.value === config.status);
      summary = opt?.label || config.status;
    } else if (data?.actionType === 'update_category' && config?.category) summary = config.category;
    else if (data?.actionType === 'update_contact_tags' && config?.tags) summary = config.tags;
    else if (data?.actionType === 'create_task' && config?.taskTitle) summary = config.taskTitle;
    else if (data?.actionType === 'distribute_leads' && config?.agents) summary = config.agents;
    else if (data?.actionType === 'response_task_router' && config?.taskTitle) summary = config.taskTitle;
    else if (data?.actionType === 'delay' && config?.amount) {
      const unitLabels = { seconds: lang === 'he' ? 'שניות' : 'sec', minutes: lang === 'he' ? 'דקות' : 'min', hours: lang === 'he' ? 'שעות' : 'hr', days: lang === 'he' ? 'ימים' : 'days' };
      summary = `${config.amount} ${unitLabels[config.unit || 'seconds'] || config.unit}`;
    }
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
              <select
                value={config?.agentId || ''}
                onChange={(e) => {
                  const user = orgUsers.find(u => (u.uID || u.Email) === e.target.value);
                  handleConfigChange('agentId', e.target.value);
                  handleConfigChange('agentName', user?.UserName || user?.FullName || e.target.value);
                }}
                className="bot-flow-properties-input"
              >
                <option value="">{lang === 'he' ? 'בחר נציג...' : 'Select agent...'}</option>
                {orgUsers.map((user, idx) => (
                  <option key={user.uID || idx} value={user.uID || user.Email}>
                    {user.UserName || user.FullName || user.Email || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          )}
          {data?.actionType === 'change_owner' && (
            <div className="bot-flow-action-field">
              <label>{t.panel.ownerName}</label>
              <select
                value={config?.ownerId || ''}
                onChange={(e) => {
                  const user = orgUsers.find(u => (u.uID || u.Email) === e.target.value);
                  handleConfigChange('ownerId', e.target.value);
                  handleConfigChange('ownerName', user?.UserName || user?.FullName || e.target.value);
                }}
                className="bot-flow-properties-input"
              >
                <option value="">{lang === 'he' ? 'בחר בעלים...' : 'Select owner...'}</option>
                {orgUsers.map((user, idx) => (
                  <option key={user.uID || idx} value={user.uID || user.Email}>
                    {user.UserName || user.FullName || user.Email || 'Unknown'}
                  </option>
                ))}
              </select>
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
          {data?.actionType === 'create_task' && (
            <div className="bot-flow-action-field">
              <label>{t.panel.taskTitleLabel}</label>
              <input
                type="text"
                value={config?.taskTitle || ''}
                onChange={(e) => handleConfigChange('taskTitle', e.target.value)}
                placeholder={t.panel.taskTitlePlaceholder}
                className="bot-flow-properties-input"
              />
              <label style={{ marginTop: 6 }}>{t.panel.taskAssigneeLabel}</label>
              <input
                type="text"
                value={config?.taskAssignee || ''}
                onChange={(e) => handleConfigChange('taskAssignee', e.target.value)}
                placeholder={t.panel.taskAssigneePlaceholder}
                className="bot-flow-properties-input"
              />
            </div>
          )}
          {data?.actionType === 'distribute_leads' && (
            <div className="bot-flow-action-field">
              <label>{t.panel.distributeAgentsLabel}</label>
              <input
                type="text"
                value={config?.agents || ''}
                onChange={(e) => handleConfigChange('agents', e.target.value)}
                placeholder={t.panel.distributeAgentsPlaceholder}
                className="bot-flow-properties-input"
              />
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: 4, lineHeight: 1.4 }}>
                {lang === 'he'
                  ? '⚖️ כל ליד חדש ישויך לנציג הבא ברשימה (round-robin)'
                  : '⚖️ Each new lead will be assigned to the next agent in turn (round-robin)'}
              </div>
            </div>
          )}
          {data?.actionType === 'response_task_router' && (() => {
            const defaultRows = lang === 'he'
              ? [{ answer: 'בוקר', time: '10:00' }, { answer: 'צהריים', time: '13:00' }, { answer: 'ערב', time: '19:00' }]
              : [{ answer: 'Morning', time: '10:00' }, { answer: 'Noon', time: '13:00' }, { answer: 'Evening', time: '19:00' }];
            const currentRows = config?.rows || defaultRows;
            return (
              <div className="bot-flow-action-field">
                <label>{t.panel.rtrTaskTitleLabel}</label>
                <input
                  type="text"
                  value={config?.taskTitle || ''}
                  onChange={(e) => handleConfigChange('taskTitle', e.target.value)}
                  placeholder={t.panel.rtrTaskTitlePlaceholder}
                  className="bot-flow-properties-input"
                />
                <label style={{ marginTop: 6 }}>{t.panel.rtrAssigneeLabel}</label>
                <input
                  type="text"
                  value={config?.taskAssignee || ''}
                  onChange={(e) => handleConfigChange('taskAssignee', e.target.value)}
                  placeholder={t.panel.rtrAssigneePlaceholder}
                  className="bot-flow-properties-input"
                />
                <div style={{ marginTop: 10, borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    <span style={{ flex: 2 }}>{t.panel.rtrAnswerLabel}</span>
                    <span style={{ flex: 1 }}>{t.panel.rtrTimeLabel}</span>
                    <span style={{ width: 18 }} />
                  </div>
                  {currentRows.map((row, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' }}>
                      <input
                        type="text"
                        className="bot-flow-properties-input"
                        style={{ flex: 2 }}
                        value={row.answer}
                        onChange={(e) => handleConfigChange('rows', currentRows.map((r, i) => i === idx ? { ...r, answer: e.target.value } : r))}
                        placeholder={t.panel.rtrAnswerLabel}
                      />
                      <input
                        type="text"
                        className="bot-flow-properties-input"
                        style={{ flex: 1 }}
                        value={row.time}
                        onChange={(e) => handleConfigChange('rows', currentRows.map((r, i) => i === idx ? { ...r, time: e.target.value } : r))}
                        placeholder="10:00"
                      />
                      <button
                        style={{ width: 18, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 14, padding: 0, lineHeight: 1 }}
                        onClick={() => handleConfigChange('rows', currentRows.filter((_, i) => i !== idx))}
                      >×</button>
                    </div>
                  ))}
                  <button
                    className="bot-flow-properties-input"
                    style={{ marginTop: 4, background: '#f0fdf4', border: '1px dashed #86efac', color: '#16a34a', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}
                    onClick={() => handleConfigChange('rows', [...currentRows, { answer: '', time: '' }])}
                  >
                    {t.panel.rtrAddRow}
                  </button>
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: 6, lineHeight: 1.4 }}>
                  {t.panel.rtrNote}
                </div>
              </div>
            );
          })()}
          {data?.actionType === 'delay' && (
            <div className="bot-flow-action-field">
              <label>{lang === 'he' ? 'משך השהייה' : 'Delay Duration'}</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={config?.amount || 1}
                  onChange={(e) => handleConfigChange('amount', parseInt(e.target.value, 10) || 1)}
                  className="bot-flow-properties-input"
                  style={{ width: 70, textAlign: 'center' }}
                />
                <select
                  value={config?.unit || 'seconds'}
                  onChange={(e) => handleConfigChange('unit', e.target.value)}
                  className="bot-flow-properties-input"
                  style={{ flex: 1 }}
                >
                  <option value="seconds">{lang === 'he' ? 'שניות' : 'Seconds'}</option>
                  <option value="minutes">{lang === 'he' ? 'דקות' : 'Minutes'}</option>
                  <option value="hours">{lang === 'he' ? 'שעות' : 'Hours'}</option>
                  <option value="days">{lang === 'he' ? 'ימים' : 'Days'}</option>
                </select>
              </div>
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
    type: 'smoothstep',
    animated: true,
    source: '1',
    target: '2',
    sourceHandle: 'order',
    targetHandle: 'target',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3a7a6c' },
    label: 'הזמנה',
    labelStyle: { fill: '#1e293b', fontWeight: 600, fontSize: 12 },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.95 },
    labelBgPadding: [6, 10],
    labelBgBorderRadius: 6,
    style: { stroke: '#3a7a6c', strokeWidth: 2.5 },
  },
  {
    id: 'e1-3',
    type: 'smoothstep',
    animated: true,
    source: '1',
    target: '3',
    sourceHandle: 'info',
    targetHandle: 'target',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
    label: 'מידע',
    labelStyle: { fill: '#1e293b', fontWeight: 600, fontSize: 12 },
    labelBgStyle: { fill: '#fff', fillOpacity: 0.95 },
    labelBgPadding: [6, 10],
    labelBgBorderRadius: 6,
    style: { stroke: '#8b5cf6', strokeWidth: 2.5 },
  },
];

const BOT_FLOW_STORAGE_KEY = 'gambot_bot_flow';
const BOT_FLOW_MULTI_KEY = 'gambot_bot_flows_multi';

let nodeId = 4;
const getId = () => `node_${nodeId++}`;
const syncNodeIdCounter = (nodes) => {
  if (!Array.isArray(nodes)) return;
  let max = nodeId;
  for (const n of nodes) {
    const m = typeof n.id === 'string' && n.id.match(/^node_(\d+)$/);
    if (m) max = Math.max(max, parseInt(m[1], 10) + 1);
  }
  nodeId = max;
};

const BotFlowBuilderInner = ({ mode, onSave, initialFlow, nodes, setNodes, edges, setEdges, onNodesChange, onEdgesChange, userConnectingRef, flowLoadingRef, botName: propBotName, onBotNameChange }) => {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const { t, lang, organization } = useBotFlowLang();
  const TRIGGER_TYPES = getTriggerTypes(t);
  const ACTION_TYPES = getActionTypes(t);
  const updateNodeInternals = useUpdateNodeInternals();
  const storeApi = useStoreApi();
  const appliedInitialRef = React.useRef(false);
  const [saveDone, setSaveDone] = React.useState(false);
  const [localBotName, setLocalBotName] = React.useState(propBotName || '');
  React.useEffect(() => { setLocalBotName(propBotName || ''); }, [propBotName]);

  // Multi-bot management (website mode)
  const [savedBots, setSavedBots] = React.useState([]);
  const [currentBotId, setCurrentBotId] = React.useState(null);
  const [showBotsModal, setShowBotsModal] = React.useState(false);
  const [editingBotName, setEditingBotName] = React.useState('');

  React.useEffect(() => {
    if (mode !== 'website') return;
    try {
      const raw = localStorage.getItem(BOT_FLOW_MULTI_KEY);
      if (raw) setSavedBots(JSON.parse(raw));
    } catch {}
  }, [mode]);

  const edgesRef = React.useRef(edges);
  React.useEffect(() => { edgesRef.current = edges; }, [edges]);

  React.useEffect(() => {
    const unsub = storeApi.subscribe(() => {
      if (flowLoadingRef?.current || userConnectingRef?.current) return;
      const expected = edgesRef.current;
      const expectedIds = new Set(expected.map(e => e.id));
      const storeEdges = storeApi.getState().edges;
      if (storeEdges.some(e => !expectedIds.has(e.id))) {
        setTimeout(() => {
          const latest = edgesRef.current;
          const latestIds = new Set(latest.map(e => e.id));
          const current = storeApi.getState().edges;
          if (current.some(e => !latestIds.has(e.id))) {
            storeApi.getState().setEdges(latest);
          }
        }, 30);
      }
    });
    return unsub;
  }, [storeApi, flowLoadingRef, userConnectingRef]);

  const selectedNode = nodes.find((n) => n.selected);
  const selectedEdge = edges.find((e) => e.selected);
  const [showHeaderMediaPicker, setShowHeaderMediaPicker] = React.useState(false);
  const hasButtons =
    selectedNode &&
    ((selectedNode.type === 'trigger' && selectedNode.data?.triggerType === 'trigger_button') ||
      (selectedNode.type === 'message' && selectedNode.data?.messageType === 'message_template'));
  React.useEffect(() => {
    if (initialFlow && !appliedInitialRef.current) {
      appliedInitialRef.current = true;
      if (flowLoadingRef) flowLoadingRef.current = true;
      syncNodeIdCounter(initialFlow.nodes);
      setNodes(initialFlow.nodes || []);
      setEdges(initialFlow.edges || []);
      setTimeout(() => {
        (initialFlow.nodes || []).forEach((n) => updateNodeInternals(n.id));
        setTimeout(() => {
          if (flowLoadingRef) flowLoadingRef.current = false;
        }, 200);
      }, 100);
    } else if (!initialFlow) {
      if (flowLoadingRef) flowLoadingRef.current = false;
    }
  }, [initialFlow, updateNodeInternals, setNodes, setEdges, flowLoadingRef]);


  const onConnectStart = useCallback(() => {
    if (flowLoadingRef && flowLoadingRef.current) return;
    if (userConnectingRef) userConnectingRef.current = true;
  }, [userConnectingRef, flowLoadingRef]);

  const onConnectEnd = useCallback(() => {
    setTimeout(() => { if (userConnectingRef) userConnectingRef.current = false; }, 100);
  }, [userConnectingRef]);

  const isValidConnection = useCallback((connection) => {
    if (flowLoadingRef && flowLoadingRef.current) return false;
    if (userConnectingRef && !userConnectingRef.current) return false;
    if (connection.source === connection.target) return false;
    return true;
  }, [userConnectingRef, flowLoadingRef]);

  const onConnect = useCallback(
    (params) => {
      if (flowLoadingRef && flowLoadingRef.current) return;
      if (userConnectingRef && !userConnectingRef.current) return;
      const sourceNode = nodes.find((n) => n.id === params.source);
      const sourceHandle = params.sourceHandle;
      const buttons = sourceNode?.data?.buttons || [];
      const buttonLabel = buttons.find((b) => (b.payload || b.text) === sourceHandle)?.text || sourceHandle;
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            label: buttonLabel,
            labelStyle: { fill: '#1e293b', fontWeight: 600, fontSize: 12 },
            labelBgStyle: { fill: '#fff', fillOpacity: 0.95 },
            labelBgPadding: [6, 10],
            labelBgBorderRadius: 6,
            style: { stroke: '#3a7a6c', strokeWidth: 2.5 },
          },
          eds
        )
      );
    },
    [nodes, setEdges, userConnectingRef, flowLoadingRef]
  );

  const purgeEdgesForNode = useCallback((nodeId) => {
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    setTimeout(() => {
      setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      try { storeApi.getState().setEdges(storeApi.getState().edges.filter(e => e.source !== nodeId && e.target !== nodeId)); } catch(ex) {}
    }, 50);
    setTimeout(() => {
      setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      try { storeApi.getState().setEdges(storeApi.getState().edges.filter(e => e.source !== nodeId && e.target !== nodeId)); } catch(ex) {}
    }, 200);
    setTimeout(() => {
      setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      try { storeApi.getState().setEdges(storeApi.getState().edges.filter(e => e.source !== nodeId && e.target !== nodeId)); } catch(ex) {}
    }, 500);
  }, [setEdges, storeApi]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (userConnectingRef) userConnectingRef.current = false;
      const dropType = e.dataTransfer.getData('application/botflow-type');
      const dropPayload = e.dataTransfer.getData('application/botflow-payload');
      if (!dropType) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      let newNode;

      if (dropType === 'trigger') {
        const info = TRIGGER_TYPES.find((tr) => tr.type === dropPayload) || TRIGGER_TYPES[0];
        const isButton = dropPayload === 'trigger_button';
        const isWebhook = dropPayload === 'trigger_webhook';
        const isNewUser = dropPayload === 'trigger_new_user';
        const isReplyDrop = dropPayload === 'trigger_reply';
        const label = isButton ? t.defaults.triggerButton : isWebhook ? t.defaults.triggerWebhook : isNewUser ? t.defaults.triggerNewUser : isReplyDrop ? t.defaults.triggerReply : t.defaults.triggerRegular;
        newNode = {
          id: getId(),
          type: 'trigger',
          position,
          data: {
            triggerType: dropPayload,
            label,
            buttons: isButton ? [{ text: `${t.defaults.buttonN} 1`, payload: 'btn1' }] : [],
          },
        };
      } else if (dropType === 'message') {
        const isTemplate = dropPayload === 'message_template';
        const isAi = dropPayload === 'message_ai';
        const isMediaDrop = dropPayload === 'message_media';
        const label = isAi ? t.defaults.msgAi : isTemplate ? '' : isMediaDrop ? t.defaults.msgMedia : t.defaults.msgRegular;
        newNode = {
          id: getId(),
          type: 'message',
          position,
          data: {
            messageType: dropPayload,
            label,
            buttons: [],
          },
        };
      } else {
        const actionInfo = ACTION_TYPES.find((a) => a.type === dropPayload) || ACTION_TYPES[0];
        newNode = {
          id: getId(),
          type: 'action',
          position,
          data: {
            actionType: dropPayload,
            actionLabel: actionInfo.label,
            label: '',
            ...(dropPayload === 'delay' ? { config: { amount: 1, unit: 'seconds' } } : {}),
          },
        };
      }
      setNodes((nds) => nds.concat(newNode));
      purgeEdgesForNode(newNode.id);
    },
    [screenToFlowPosition, setNodes, t, purgeEdgesForNode]
  );

  const onPaletteDragStart = (e, type, payload) => {
    e.dataTransfer.setData('application/botflow-type', type);
    e.dataTransfer.setData('application/botflow-payload', payload);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = useCallback((type, payload) => {
    if (userConnectingRef) userConnectingRef.current = false;
    const maxY = nodes.reduce((max, n) => Math.max(max, (n.position?.y || 0) + 150), 100);
    const position = { x: 400 + Math.random() * 100, y: maxY + 50 };
    let newNode;
    if (type === 'trigger') {
      const isButton = payload === 'trigger_button';
      const isWebhook = payload === 'trigger_webhook';
      const isNewUser = payload === 'trigger_new_user';
      const isReplyAdd = payload === 'trigger_reply';
      const label = isButton ? t.defaults.triggerButton : isWebhook ? t.defaults.triggerWebhook : isNewUser ? t.defaults.triggerNewUser : isReplyAdd ? t.defaults.triggerReply : t.defaults.triggerRegular;
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
        data: { actionType: payload, actionLabel: actionInfo.label, label: '', ...(payload === 'delay' ? { config: { amount: 1, unit: 'seconds' } } : {}) },
      };
    }
    setNodes((nds) => nds.concat(newNode));
    purgeEdgesForNode(newNode.id);
  }, [nodes.length, setNodes, t, purgeEdgesForNode]);

  const handleSaveToStorage = useCallback(() => {
    const now = new Date().toISOString();
    const name = editingBotName.trim() || localBotName.trim() || (lang === 'he' ? `בוט ${new Date().toLocaleDateString('he-IL')}` : `Bot ${new Date().toLocaleDateString()}`);
    try {
      let bots = [];
      try { bots = JSON.parse(localStorage.getItem(BOT_FLOW_MULTI_KEY) || '[]'); } catch {}

      if (currentBotId) {
        bots = bots.map(b => b.id === currentBotId ? { ...b, name, nodes, edges, updatedAt: now } : b);
      } else {
        const newId = `bot_${Date.now()}`;
        bots.push({ id: newId, name, nodes, edges, createdAt: now, updatedAt: now });
        setCurrentBotId(newId);
      }
      localStorage.setItem(BOT_FLOW_MULTI_KEY, JSON.stringify(bots));
      localStorage.setItem(BOT_FLOW_STORAGE_KEY, JSON.stringify({ nodes, edges }));
      setSavedBots(bots);
      setSaveDone(true);
      setTimeout(() => setSaveDone(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to save flow:', err);
      return false;
    }
  }, [nodes, edges, currentBotId, editingBotName, localBotName, lang]);

  const handleLoadBot = useCallback((bot) => {
    if (flowLoadingRef) flowLoadingRef.current = true;
    syncNodeIdCounter(bot.nodes || []);
    setNodes(bot.nodes || []);
    setEdges(bot.edges || []);
    setCurrentBotId(bot.id);
    setEditingBotName(bot.name || '');
    setShowBotsModal(false);
    setTimeout(() => {
      (bot.nodes || []).forEach((n) => updateNodeInternals(n.id));
      setTimeout(() => { if (flowLoadingRef) flowLoadingRef.current = false; }, 200);
    }, 100);
  }, [setNodes, setEdges, updateNodeInternals, flowLoadingRef]);

  const handleDeleteBot = useCallback((botId) => {
    try {
      let bots = [];
      try { bots = JSON.parse(localStorage.getItem(BOT_FLOW_MULTI_KEY) || '[]'); } catch {}
      bots = bots.filter(b => b.id !== botId);
      localStorage.setItem(BOT_FLOW_MULTI_KEY, JSON.stringify(bots));
      setSavedBots(bots);
      if (currentBotId === botId) {
        setCurrentBotId(null);
        setEditingBotName('');
      }
    } catch {}
  }, [currentBotId]);

  const handleNewBot = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setCurrentBotId(null);
    setEditingBotName('');
    setShowBotsModal(false);
    nodeId = 1;
  }, [setNodes, setEdges]);

  const handleLoadFromStorage = useCallback(() => {
    setShowBotsModal(true);
  }, []);

  const handleLoadFromFile = useCallback((e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const flow = JSON.parse(ev.target?.result || '{}');
        const nodes = flow.nodes || flow.Nodes;
        const edges = flow.edges || flow.Edges;
        if (nodes?.length) {
          syncNodeIdCounter(nodes);
          setNodes(Array.isArray(nodes) ? nodes : []);
        }
        if (edges?.length) {
          const normalized = (Array.isArray(edges) ? edges : []).map((ed) => ({ ...ed, type: 'smoothstep', animated: true }));
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

  const handleAddButton = useCallback((btnType = 'QUICK_REPLY') => {
    if (!selectedNode || !hasButtons) return;
    const newBtn = { text: `${t.defaults.buttonN} ${(selectedNode.data?.buttons?.length || 0) + 1}`, payload: `btn${Date.now()}`, type: btnType };
    if (btnType === 'URL') newBtn.url = '';
    if (btnType === 'PHONE_NUMBER') newBtn.phone_number = '';
    const buttons = [...(selectedNode.data?.buttons || []), newBtn];
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

  const handleUpdateButtonField = useCallback(
    (index, field, value) => {
      if (!selectedNode || !hasButtons) return;
      const buttons = (selectedNode.data?.buttons || []).map((b, i) =>
        i === index ? { ...b, [field]: value } : b
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

  const handleDeleteEdge = useCallback(() => {
    if (!selectedEdge) return;
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
  }, [selectedEdge, setEdges]);

  // ══════════════════════════════════════════════════════════════
  // Multi-select Copy/Paste
  // ══════════════════════════════════════════════════════════════
  const copiedNodesRef = React.useRef(null);
  const [showPasteHint, setShowPasteHint] = React.useState(false);

  const selectedNodes = React.useMemo(() => nodes.filter(n => n.selected), [nodes]);

  const handleCopySelected = useCallback(() => {
    const selected = nodes.filter(n => n.selected);
    if (selected.length === 0) return;
    const selectedIds = new Set(selected.map(n => n.id));
    const relevantEdges = edges.filter(e => selectedIds.has(e.source) && selectedIds.has(e.target));
    copiedNodesRef.current = { nodes: JSON.parse(JSON.stringify(selected)), edges: JSON.parse(JSON.stringify(relevantEdges)) };
    setShowPasteHint(true);
    setTimeout(() => setShowPasteHint(false), 2500);
  }, [nodes, edges]);

  const handlePasteNodes = useCallback(() => {
    if (!copiedNodesRef.current) return;
    const { nodes: copiedNodes, edges: copiedEdges } = copiedNodesRef.current;
    const idMap = {};
    const offsetX = 50;
    const offsetY = 80;
    const newNodes = copiedNodes.map(n => {
      const newId = getId();
      idMap[n.id] = newId;
      return {
        ...n,
        id: newId,
        position: { x: n.position.x + offsetX, y: n.position.y + offsetY },
        selected: true,
      };
    });
    const newEdges = copiedEdges.map(e => ({
      ...e,
      id: `edge_${idMap[e.source]}_${idMap[e.target]}_${Date.now()}`,
      source: idMap[e.source],
      target: idMap[e.target],
    }));
    setNodes(nds => nds.map(n => ({ ...n, selected: false })).concat(newNodes));
    setEdges(eds => eds.concat(newEdges));
  }, [setNodes, setEdges]);

  const handleDeleteSelected = useCallback(() => {
    const selected = nodes.filter(n => n.selected);
    if (selected.length === 0) return;
    const selectedIds = new Set(selected.map(n => n.id));
    setNodes(nds => nds.filter(n => !selectedIds.has(n.id)));
    setEdges(eds => eds.filter(e => !selectedIds.has(e.source) && !selectedIds.has(e.target)));
  }, [nodes, setNodes, setEdges]);

  React.useEffect(() => {
    const handler = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target?.isContentEditable) return;

      const isCopy = (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'ב');
      const isPaste = (e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V' || e.key === 'ה');

      if (isCopy) {
        e.preventDefault();
        handleCopySelected();
      } else if (isPaste) {
        e.preventDefault();
        handlePasteNodes();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleCopySelected, handlePasteNodes]);

  const handleDashboardSave = useCallback(() => {
    if (onSave) {
      onSave({ nodes, edges, name: localBotName });
      setSaveDone(true);
      setTimeout(() => setSaveDone(false), 2000);
    }
  }, [onSave, nodes, edges, localBotName]);

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

        {/* Reply trigger - also shown here for discoverability as mid-flow node */}
        <div
          className="bot-flow-palette-item bot-flow-palette-item-highlight"
          draggable
          onDragStart={(e) => onPaletteDragStart(e, 'trigger', 'trigger_reply')}
          style={{ borderColor: '#0d9488', background: '#f0fdfa' }}
        >
          <span className="bot-flow-palette-icon">↩️</span>
          {lang === 'he' ? 'ענה להודעה האחרונה' : 'Reply to last message'}
        </div>

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

      {/* Settings panel - opens on left when a node is selected */}
      {selectedNode && (
        <div className="bot-flow-settings-panel">
          <div className="bot-flow-settings-panel-header">
            <span className="bot-flow-settings-panel-title">
              {lang === 'he' ? '⚙️ הגדרות צומת' : '⚙️ Node Settings'}
            </span>
            <button
              type="button"
              className="bot-flow-settings-panel-close"
              onClick={() => { setNodes(nds => nds.map(n => ({ ...n, selected: false }))); }}
            >✕</button>
          </div>
          <div className="bot-flow-settings-panel-body">
            {/* Node type badge + description on same row */}
            <div className="bot-flow-settings-section" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div className="bot-flow-settings-label">{lang === 'he' ? 'סוג' : 'Type'}</div>
                <div className="bot-flow-settings-value">
                  {selectedNode.type === 'trigger'
                    ? (getTriggerTypes(t).find(tr => tr.type === selectedNode.data?.triggerType)?.label || selectedNode.data?.triggerType)
                    : selectedNode.type === 'message'
                      ? (getActionTypes(t).find(a => a.type === selectedNode.data?.messageType)?.label || selectedNode.data?.messageType)
                      : (getActionTypes(t).find(a => a.type === selectedNode.data?.actionType)?.label || selectedNode.data?.actionType)}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="bot-flow-settings-label">{lang === 'he' ? 'תיאור' : 'Label'}</div>
                <input
                  type="text"
                  className="bot-flow-settings-input"
                  value={selectedNode.data?.nodeTag || ''}
                  onChange={(e) => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, nodeTag: e.target.value } } : n))}
                  placeholder={lang === 'he' ? 'תיאור לצומת' : 'Node description'}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            {/* Template name */}
            {selectedNode.data?.templateName && (
              <div className="bot-flow-settings-section">
                <div className="bot-flow-settings-label">{lang === 'he' ? 'שם תבנית' : 'Template'}</div>
                <div className="bot-flow-settings-value" style={{ color: '#047857', fontWeight: 600 }}>
                  📋 {selectedNode.data.templateName}
                </div>
              </div>
            )}
            {/* Template category */}
            {selectedNode.type === 'message' && selectedNode.data?.messageType === 'message_template' && (
              <div className="bot-flow-settings-section">
                <div className="bot-flow-settings-label">{lang === 'he' ? 'קטגוריית תבנית' : 'Template Category'}</div>
                <select
                  className="bot-flow-settings-input"
                  value={selectedNode.data?.templateCategory || 'MARKETING'}
                  onChange={(e) => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, templateCategory: e.target.value } } : n))}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 13 }}
                >
                  <option value="MARKETING">{lang === 'he' ? '📢 שיווק (Marketing)' : '📢 Marketing'}</option>
                  <option value="UTILITY">{lang === 'he' ? '🔧 שירות (Utility)' : '🔧 Utility'}</option>
                </select>
              </div>
            )}
            {/* Header */}
            {(selectedNode.data?.messageType === 'message_template' || selectedNode.data?.triggerType === 'trigger_button') && (
              <div className="bot-flow-settings-section">
                <div className="bot-flow-settings-label">
                  {lang === 'he' ? 'כותרת (Header)' : 'Header'}
                </div>
                <select
                  className="bot-flow-settings-input"
                  value={selectedNode.data?.templateHeaderType || 'NONE'}
                  onChange={(e) => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, templateHeaderType: e.target.value, templateHeader: '', templateHeaderMedia: '' } } : n))}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 13, marginBottom: 8 }}
                >
                  <option value="NONE">{lang === 'he' ? 'ללא' : 'None'}</option>
                  <option value="TEXT">{lang === 'he' ? 'טקסט' : 'Text'}</option>
                  <option value="IMAGE">{lang === 'he' ? 'תמונה' : 'Image'}</option>
                  <option value="VIDEO">{lang === 'he' ? 'סרטון' : 'Video'}</option>
                  <option value="DOCUMENT">{lang === 'he' ? 'מסמך' : 'Document'}</option>
                  <option value="LOCATION">{lang === 'he' ? 'מיקום' : 'Location'}</option>
                </select>
                {selectedNode.data.templateHeaderType === 'TEXT' && (
                  <input
                    type="text"
                    className="bot-flow-settings-input"
                    value={selectedNode.data?.templateHeader || ''}
                    onChange={(e) => {
                      setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, templateHeader: e.target.value } } : n));
                    }}
                    placeholder={lang === 'he' ? 'טקסט כותרת' : 'Header text'}
                    maxLength={60}
                  />
                )}
                {['IMAGE', 'VIDEO', 'DOCUMENT'].includes(selectedNode.data.templateHeaderType) && (
                  <div className="bot-flow-settings-media-upload">
                    {selectedNode.data.templateHeaderMedia ? (
                      <div className="bot-flow-settings-media-preview">
                        {selectedNode.data.templateHeaderType === 'IMAGE' && (
                          <img src={selectedNode.data.templateHeaderMedia} alt="" style={{ maxWidth: '100%', borderRadius: 8, maxHeight: 120 }} />
                        )}
                        {selectedNode.data.templateHeaderType === 'VIDEO' && (
                          <video src={selectedNode.data.templateHeaderMedia} style={{ maxWidth: '100%', borderRadius: 8, maxHeight: 120 }} controls />
                        )}
                        {selectedNode.data.templateHeaderType === 'DOCUMENT' && (
                          <a href={selectedNode.data.templateHeaderMedia} target="_blank" rel="noopener noreferrer" style={{ color: '#2e6155', fontWeight: 500 }}>
                            📄 {lang === 'he' ? 'צפה במסמך' : 'View Document'}
                          </a>
                        )}
                        <button
                          type="button"
                          className="bot-flow-settings-media-remove"
                          onClick={() => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, templateHeaderMedia: '' } } : n))}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="text"
                          className="bot-flow-settings-input"
                          value={selectedNode.data?.templateHeaderMedia || ''}
                          onChange={(e) => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, templateHeaderMedia: e.target.value } } : n))}
                          placeholder={lang === 'he' ? 'הדבק כתובת URL' : 'Paste media URL'}
                          style={{ marginBottom: 6 }}
                        />
                        <div style={{ display: 'flex', gap: 6 }}>
                          <label className="bot-flow-settings-upload-btn" style={{ flex: 1, textAlign: 'center', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '7px 10px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 12, fontWeight: 500, background: '#fff', color: '#374151' }}>
                            📁 {lang === 'he' ? 'העלה קובץ' : 'Upload'}
                            <input
                              type="file"
                              accept={
                                selectedNode.data.templateHeaderType === 'IMAGE' ? 'image/*' :
                                selectedNode.data.templateHeaderType === 'VIDEO' ? 'video/*' : '.pdf,.doc,.docx,.xls,.xlsx'
                              }
                              style={{ display: 'none' }}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('organization', organization);
                                try {
                                  const uploadRes = await fetch(`${BOT_FLOW_API_BASE}/api/Gambot/UploadMediaFile`, { method: 'POST', body: formData });
                                  const uploadData = await uploadRes.json();
                                  const files = uploadData?.files || [];
                                  const url = files[0]?.url || uploadData?.Url || uploadData?.url || uploadData?.MediaUrl || '';
                                  if (url) {
                                    setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, templateHeaderMedia: url } } : n));
                                  }
                                } catch (err) {
                                  console.error('Upload failed:', err);
                                }
                              }}
                            />
                          </label>
                          {organization && (
                            <button
                              type="button"
                              onClick={() => setShowHeaderMediaPicker(true)}
                              style={{ flex: 1, textAlign: 'center', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '7px 10px', borderRadius: 8, border: '1.5px solid #0891b2', fontSize: 12, fontWeight: 500, background: '#fff', color: '#0891b2' }}
                            >
                              🗂️ {lang === 'he' ? 'מהמדיה' : 'Media Library'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {selectedNode.data.templateHeaderType === 'LOCATION' && (
                  <div className="bot-flow-settings-location">
                    <input
                      type="text"
                      className="bot-flow-settings-input"
                      value={selectedNode.data?.templateHeaderMedia || ''}
                      onChange={(e) => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, templateHeaderMedia: e.target.value } } : n))}
                      placeholder={lang === 'he' ? 'קו רוחב, קו אורך (lat, lng)' : 'Latitude, Longitude'}
                    />
                    <small style={{ color: '#6b7280', fontSize: 11 }}>
                      {lang === 'he' ? 'דוגמה: 32.0853, 34.7818' : 'Example: 32.0853, 34.7818'}
                    </small>
                  </div>
                )}
              </div>
            )}
            {/* Body - editable */}
            {(selectedNode.type === 'message' || selectedNode.type === 'trigger') && (
              <div className="bot-flow-settings-section">
                <div className="bot-flow-settings-label">Body</div>
                <textarea
                  id="bot-flow-body-textarea"
                  className="bot-flow-settings-textarea"
                  value={selectedNode.data?.label || ''}
                  onChange={(e) => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: e.target.value } } : n))}
                  placeholder={lang === 'he' ? 'טקסט ההודעה... (השתמש ב-{{1}} למשתנים)' : 'Message text... (use {{1}} for variables)'}
                  rows={4}
                  dir={lang === 'he' ? 'rtl' : 'ltr'}
                />
                <button
                  type="button"
                  className="bot-flow-settings-var-add-btn"
                  onClick={() => {
                    const body = selectedNode.data?.label || '';
                    const existing = body.match(/\{\{(\d+)\}\}/g) || [];
                    const nums = existing.map(m => parseInt(m.replace(/[{}]/g, ''), 10));
                    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
                    const textarea = document.getElementById('bot-flow-body-textarea');
                    const cursorPos = textarea ? textarea.selectionStart : body.length;
                    const newBody = body.slice(0, cursorPos) + `{{${next}}}` + body.slice(cursorPos);
                    setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: newBody } } : n));
                  }}
                >
                  {`{{}}`} {lang === 'he' ? 'הוסף משתנה' : 'Add variable'}
                </button>
              </div>
            )}
            {/* Variables extracted from body {{1}}, {{2}}, etc. */}
            {(selectedNode.type === 'message' || selectedNode.type === 'trigger') && (() => {
              const bodyText = selectedNode.data?.label || '';
              const varMatches = bodyText.match(/\{\{(\d+)\}\}/g);
              if (!varMatches || varMatches.length === 0) return null;
              const uniqueVars = [...new Set(varMatches)].sort((a, b) => {
                const numA = parseInt(a.replace(/[{}]/g, ''), 10);
                const numB = parseInt(b.replace(/[{}]/g, ''), 10);
                return numA - numB;
              });
              const variables = selectedNode.data?.templateVariables || {};
              const varSources = selectedNode.data?.templateVariableSources || {};
              const sourceOptions = [
                { value: 'custom', label: lang === 'he' ? '✏️ טקסט חופשי' : '✏️ Custom text' },
                { value: 'contact_name', label: lang === 'he' ? '👤 שם איש קשר' : '👤 Contact name' },
                { value: 'contact_phone', label: lang === 'he' ? '📱 טלפון איש קשר' : '📱 Contact phone' },
                { value: 'contact_email', label: lang === 'he' ? '📧 אימייל איש קשר' : '📧 Contact email' },
                { value: 'sender_name', label: lang === 'he' ? '👤 שם שולח (מהטריגר)' : '👤 Sender name (trigger)' },
                { value: 'sender_phone', label: lang === 'he' ? '📱 טלפון שולח (מהטריגר)' : '📱 Sender phone (trigger)' },
                { value: 'lead_name', label: lang === 'he' ? '🎯 שם ליד' : '🎯 Lead name' },
                { value: 'lead_status', label: lang === 'he' ? '🎯 סטטוס ליד' : '🎯 Lead status' },
                { value: 'case_subject', label: lang === 'he' ? '📋 נושא פנייה' : '📋 Case subject' },
                { value: 'current_date', label: lang === 'he' ? '📅 תאריך נוכחי' : '📅 Current date' },
                { value: 'business_name', label: lang === 'he' ? '🏢 שם העסק' : '🏢 Business name' },
                { value: 'step_output', label: lang === 'he' ? '🔗 פלט משלב קודם' : '🔗 Previous step output' },
              ];
              return (
                <div className="bot-flow-settings-section">
                  <div className="bot-flow-settings-label">{lang === 'he' ? 'משתנים' : 'Variables'}</div>
                  <div className="bot-flow-settings-vars">
                    {uniqueVars.map((v) => {
                      const varKey = v.replace(/[{}]/g, '');
                      const source = varSources[varKey] || 'custom';
                      return (
                        <div key={v} className="bot-flow-settings-var-item" style={{ flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                            <span className="bot-flow-settings-var-badge">{v}</span>
                            <select
                              className="bot-flow-settings-input"
                              style={{ flex: 1, fontSize: 12 }}
                              value={source}
                              onChange={(e) => {
                                const updatedSources = { ...varSources, [varKey]: e.target.value };
                                const sourceVal = e.target.value;
                                let autoValue = '';
                                if (sourceVal === 'contact_name') autoValue = '{{contact_name}}';
                                else if (sourceVal === 'contact_phone') autoValue = '{{contact_phone}}';
                                else if (sourceVal === 'contact_email') autoValue = '{{contact_email}}';
                                else if (sourceVal === 'sender_name') autoValue = '{{Step_1_SenderName}}';
                                else if (sourceVal === 'sender_phone') autoValue = '{{Step_1_PhoneNumber}}';
                                else if (sourceVal === 'lead_name') autoValue = '{{lead_name}}';
                                else if (sourceVal === 'lead_status') autoValue = '{{lead_status}}';
                                else if (sourceVal === 'case_subject') autoValue = '{{case_subject}}';
                                else if (sourceVal === 'current_date') autoValue = '{{current_date}}';
                                else if (sourceVal === 'business_name') autoValue = '{{business_name}}';
                                const updatedVars = { ...variables, [varKey]: autoValue };
                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, templateVariableSources: updatedSources, templateVariables: updatedVars } } : n));
                              }}
                            >
                              {sourceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                          </div>
                          {(source === 'custom' || source === 'step_output') && (
                            <input
                              type="text"
                              className="bot-flow-settings-input"
                              style={{ fontSize: 12 }}
                              value={variables[varKey] || ''}
                              onChange={(e) => {
                                const updated = { ...variables, [varKey]: e.target.value };
                                setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, templateVariables: updated } } : n));
                              }}
                              placeholder={source === 'step_output'
                                ? (lang === 'he' ? 'לדוגמה: {{Step_2_leadName}}' : 'e.g. {{Step_2_leadName}}')
                                : (lang === 'he' ? `ערך למשתנה ${v}` : `Value for ${v}`)}
                            />
                          )}
                          {source !== 'custom' && source !== 'step_output' && (
                            <div style={{ fontSize: 11, color: '#10b981', padding: '2px 4px' }}>
                              ← {variables[varKey] || ''}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            {/* Footer - editable */}
            {(selectedNode.data?.messageType === 'message_template' || selectedNode.type === 'trigger') && (
              <div className="bot-flow-settings-section">
                <div className="bot-flow-settings-label">Footer</div>
                <input
                  type="text"
                  className="bot-flow-settings-input"
                  value={selectedNode.data?.templateFooter || ''}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, 60);
                    setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, templateFooter: val } } : n));
                  }}
                  placeholder={lang === 'he' ? 'Footer (אופציונלי, עד 60 תווים)' : 'Footer (optional, max 60 chars)'}
                  maxLength={60}
                />
              </div>
            )}
            {/* Buttons editor - full editing in panel */}
            {(selectedNode.data?.messageType === 'message_template' || selectedNode.data?.triggerType === 'trigger_button') && (() => {
              const btns = selectedNode.data?.buttons || [];
              const qrCount = btns.filter(b => !b.type || b.type === 'QUICK_REPLY').length;
              const urlCount = btns.filter(b => b.type === 'URL').length;
              const phoneCount = btns.filter(b => b.type === 'PHONE_NUMBER').length;
              const totalCount = btns.length;
              const canAddQR = qrCount < 10 && totalCount < 10;
              const canAddURL = urlCount < 2 && totalCount < 10;
              const canAddPhone = phoneCount < 1 && totalCount < 10;
              const canAdd = canAddQR || canAddURL || canAddPhone;
              return (
                <div className="bot-flow-settings-section">
                  <div className="bot-flow-settings-label">{lang === 'he' ? 'לחצנים' : 'Buttons'}</div>
                  <div className="bot-flow-settings-btn-limits">
                    <span>{lang === 'he' ? `תגובות: ${qrCount}/10` : `QR: ${qrCount}/10`}</span>
                    <span>{lang === 'he' ? `URL: ${urlCount}/2` : `URL: ${urlCount}/2`}</span>
                    <span>{lang === 'he' ? `טלפון: ${phoneCount}/1` : `Phone: ${phoneCount}/1`}</span>
                  </div>
                  {btns.map((btn, i) => (
                    <div key={i} className="bot-flow-settings-btn-item">
                      <div className="bot-flow-settings-btn-row">
                        <select
                          className="bot-flow-settings-select"
                          value={btn.type || 'QUICK_REPLY'}
                          onChange={(e) => {
                            const newType = e.target.value;
                            const updated = btns.map((b, idx) => {
                              if (idx !== i) return b;
                              const base = { text: b.text, payload: b.payload, type: newType };
                              if (newType === 'URL') { base.url = b.url || ''; base.urlType = b.urlType || 'static'; base.trackClicks = false; }
                              if (newType === 'PHONE_NUMBER') base.phone_number = b.phone_number || '';
                              return base;
                            });
                            setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: updated } } : n));
                          }}
                          style={{ flex: 1, fontSize: 11 }}
                        >
                          <option value="QUICK_REPLY">{lang === 'he' ? 'תגובה מהירה' : 'Quick Reply'}</option>
                          <option value="URL" disabled={urlCount >= 2 && (btn.type !== 'URL')}>{lang === 'he' ? 'קישור (URL)' : 'URL'}</option>
                          <option value="PHONE_NUMBER" disabled={phoneCount >= 1 && (btn.type !== 'PHONE_NUMBER')}>{lang === 'he' ? 'טלפון' : 'Phone'}</option>
                        </select>
                        <button
                          type="button"
                          className="bot-flow-settings-btn-remove"
                          onClick={() => {
                            const updated = btns.filter((_, idx) => idx !== i);
                            setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: updated } } : n));
                            setTimeout(() => updateNodeInternals(selectedNode.id), 50);
                          }}
                        >×</button>
                      </div>
                      <input
                        type="text"
                        className="bot-flow-settings-input"
                        value={btn.text || ''}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, 24);
                          const updated = btns.map((b, idx) => idx === i ? { ...b, text: val } : b);
                          setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: updated } } : n));
                        }}
                        placeholder={lang === 'he' ? 'טקסט הלחצן (24 תווים)' : 'Button text (24 chars)'}
                        maxLength={24}
                      />
                      {btn.type === 'URL' && (
                        <input
                          type="text"
                          className="bot-flow-settings-input"
                          value={btn.url || ''}
                          onChange={(e) => {
                            const updated = btns.map((b, idx) => idx === i ? { ...b, url: e.target.value } : b);
                            setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: updated } } : n));
                          }}
                          placeholder="https://example.com"
                          dir="ltr"
                        />
                      )}
                      {btn.type === 'PHONE_NUMBER' && (
                        <input
                          type="text"
                          className="bot-flow-settings-input"
                          value={btn.phone_number || ''}
                          onChange={(e) => {
                            const updated = btns.map((b, idx) => idx === i ? { ...b, phone_number: e.target.value } : b);
                            setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: updated } } : n));
                          }}
                          placeholder="+97233768997"
                          dir="ltr"
                        />
                      )}
                    </div>
                  ))}
                  {canAdd && (
                    <button
                      type="button"
                      className="bot-flow-settings-btn-add"
                      onClick={() => {
                        const defaultType = canAddQR ? 'QUICK_REPLY' : canAddURL ? 'URL' : 'PHONE_NUMBER';
                        const newBtn = { text: `${lang === 'he' ? 'לחצן' : 'Button'} ${btns.length + 1}`, payload: `btn${Date.now()}`, type: defaultType };
                        if (defaultType === 'URL') { newBtn.url = ''; newBtn.urlType = 'static'; }
                        if (defaultType === 'PHONE_NUMBER') newBtn.phone_number = '';
                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: [...btns, newBtn] } } : n));
                        setTimeout(() => updateNodeInternals(selectedNode.id), 50);
                      }}
                    >+ {lang === 'he' ? 'הוסף לחצן' : 'Add button'}</button>
                  )}
                  {!canAdd && (
                    <div className="bot-flow-settings-btn-limit-msg">
                      {lang === 'he' ? '⚠️ הגעת למקסימום לחצנים (10)' : '⚠️ Max buttons reached (10)'}
                    </div>
                  )}
                </div>
              );
            })()}
            {/* Fallback action for templates */}
            {selectedNode.data?.messageType === 'message_template' && (
              <div className="bot-flow-settings-section">
                <div className="bot-flow-settings-label">{lang === 'he' ? 'Fallback (טקסט חופשי)' : 'Text fallback'}</div>
                <select
                  className="bot-flow-settings-select"
                  value={selectedNode.data?.fallbackAction || 'none'}
                  onChange={(e) => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, fallbackAction: e.target.value } } : n))}
                >
                  <option value="none">{lang === 'he' ? 'ללא' : 'None'}</option>
                  <option value="resend">{lang === 'he' ? 'שלח שוב' : 'Resend'}</option>
                  <option value="branch">{lang === 'he' ? 'ענף — טפל בטקסט' : 'Branch'}</option>
                  <option value="ignore">{lang === 'he' ? 'התעלם' : 'Ignore'}</option>
                </select>
              </div>
            )}
            {/* Business hours alternative for regular messages */}
            {selectedNode.data?.messageType === 'message_regular' && (
              <div className="bot-flow-settings-section">
                <div className="bot-flow-settings-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🕐</span>
                  {lang === 'he' ? 'הודעה מחוץ לשעות פעילות' : 'Outside business hours message'}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={selectedNode.data?.businessHoursAlternative?.enabled || false}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, businessHoursAlternative: { ...n.data.businessHoursAlternative, enabled } } } : n));
                    }}
                  />
                  {lang === 'he' ? 'שלח הודעה שונה מחוץ לשעות פעילות' : 'Send different message outside business hours'}
                </label>
                {selectedNode.data?.businessHoursAlternative?.enabled && (
                  <textarea
                    className="bot-flow-settings-textarea"
                    value={selectedNode.data?.businessHoursAlternative?.outsideHoursMessage || ''}
                    onChange={(e) => {
                      setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, businessHoursAlternative: { ...n.data.businessHoursAlternative, outsideHoursMessage: e.target.value } } } : n));
                    }}
                    placeholder={lang === 'he' ? 'טקסט חלופי מחוץ לשעות פעילות...' : 'Alternative text outside business hours...'}
                    rows={3}
                    dir={lang === 'he' ? 'rtl' : 'ltr'}
                  />
                )}
              </div>
            )}
            {/* Delay settings in panel */}
            {selectedNode.type === 'action' && selectedNode.data?.actionType === 'delay' && (
              <div className="bot-flow-settings-section">
                <div className="bot-flow-settings-label">{lang === 'he' ? 'הגדרות השהייה' : 'Delay Settings'}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={selectedNode.data?.config?.amount || 1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 1;
                      setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, config: { ...n.data.config, amount: val } } } : n));
                    }}
                    className="bot-flow-settings-input"
                    style={{ width: 70, textAlign: 'center' }}
                  />
                  <select
                    value={selectedNode.data?.config?.unit || 'seconds'}
                    onChange={(e) => {
                      setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, config: { ...n.data.config, unit: e.target.value } } } : n));
                    }}
                    className="bot-flow-settings-input"
                    style={{ flex: 1 }}
                  >
                    <option value="seconds">{lang === 'he' ? 'שניות' : 'Seconds'}</option>
                    <option value="minutes">{lang === 'he' ? 'דקות' : 'Minutes'}</option>
                    <option value="hours">{lang === 'he' ? 'שעות' : 'Hours'}</option>
                    <option value="days">{lang === 'he' ? 'ימים' : 'Days'}</option>
                  </select>
                </div>
              </div>
            )}
            {/* Action config */}
            {selectedNode.data?.config && Object.keys(selectedNode.data.config).length > 0 && (
              <div className="bot-flow-settings-section">
                <div className="bot-flow-settings-label">{lang === 'he' ? 'הגדרות פעולה' : 'Action config'}</div>
                {Object.entries(selectedNode.data.config).map(([key, val]) => (
                  <div key={key} style={{ fontSize: 11, color: '#374151', padding: '2px 0' }}>
                    <strong>{key}:</strong> {String(val)}
                  </div>
                ))}
              </div>
            )}
            {/* Delete button at bottom */}
            <div className="bot-flow-settings-section" style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className="bot-flow-settings-btn-delete"
                onClick={handleDeleteNode}
              >
                🗑️ {lang === 'he' ? 'מחק צומת' : 'Delete node'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-select floating toolbar */}
      {selectedNodes.length > 1 && (
        <div className="bot-flow-multi-toolbar">
          <span className="bot-flow-multi-toolbar-count">
            {selectedNodes.length} {lang === 'he' ? 'נבחרו' : 'selected'}
          </span>
          <button type="button" onClick={handleCopySelected} title="Ctrl+C">
            📋 {lang === 'he' ? 'העתק' : 'Copy'}
          </button>
          <button type="button" onClick={handleDeleteSelected} className="bot-flow-multi-toolbar-delete">
            🗑️ {lang === 'he' ? 'מחק' : 'Delete'}
          </button>
        </div>
      )}

      {/* Paste hint */}
      {showPasteHint && (
        <div className="bot-flow-paste-hint">
          {lang === 'he' ? '✅ הועתק! הדבק עם Ctrl+V' : '✅ Copied! Paste with Ctrl+V'}
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        isValidConnection={isValidConnection}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        className="bot-flow-canvas"
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ stroke: '#3a7a6c', strokeWidth: 2.5, strokeDasharray: '8 4' }}
        connectOnClick={false}
        connectionRadius={0}
        selectionOnDrag
        selectionMode="partial"
        multiSelectionKeyCode="Shift"
        snapToGrid
        snapGrid={[10, 10]}
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3a7a6c' },
          labelStyle: { fill: '#1e293b', fontWeight: 600, fontSize: 12 },
          labelBgStyle: { fill: '#fff', fillOpacity: 0.95 },
          labelBgPadding: [6, 10],
          labelBgBorderRadius: 6,
          style: { stroke: '#3a7a6c', strokeWidth: 2.5 },
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right" className="bot-flow-panel">
          {mode === 'dashboard' && onSave && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
              <input
                type="text"
                value={localBotName}
                onChange={(e) => {
                  setLocalBotName(e.target.value);
                  if (onBotNameChange) onBotNameChange(e.target.value);
                }}
                placeholder={t.panel.botNamePlaceholder}
                className="bot-flow-properties-input"
                style={{ fontSize: '13px', fontWeight: 600 }}
              />
              <button
                type="button"
                className={`bot-flow-btn ${saveDone ? 'bot-flow-btn-save' : 'bot-flow-btn-convert'}`}
                onClick={handleDashboardSave}
                style={{ width: '100%' }}
              >
                {saveDone ? t.panel.saveDashboardDone : t.panel.saveDashboard}
              </button>
            </div>
          )}
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
          {selectedEdge && (
            <button
              type="button"
              className="bot-flow-btn bot-flow-btn-delete"
              onClick={handleDeleteEdge}
              title={t.messages.deleteEdgeTitle}
              style={{ background: '#dc2626', color: '#fff', borderColor: '#dc2626' }}
            >
              ✕ {t.messages.deleteEdge}
            </button>
          )}
          {mode === 'website' && (
            <>
              <input
                type="text"
                value={editingBotName}
                onChange={(e) => setEditingBotName(e.target.value)}
                placeholder={lang === 'he' ? 'שם הבוט...' : 'Bot name...'}
                className="bot-flow-properties-input"
                style={{ fontSize: '12px', fontWeight: 600, marginBottom: 4 }}
              />
              <button type="button" className={`bot-flow-btn ${saveDone ? 'bot-flow-btn-save' : 'bot-flow-btn-convert'}`} onClick={handleSaveToStorage}>
                {saveDone ? '✓ ' + (lang === 'he' ? 'נשמר!' : 'Saved!') : (lang === 'he' ? 'שמור' : 'Save')}
              </button>
              <button type="button" className="bot-flow-btn bot-flow-btn-load" onClick={() => setShowBotsModal(true)}>
                {lang === 'he' ? `הבוטים שלי (${savedBots.length})` : `My Bots (${savedBots.length})`}
              </button>
              <button type="button" className="bot-flow-btn" onClick={handleNewBot} style={{ background: '#f0fdf4', borderColor: '#86efac', color: '#16a34a' }}>
                + {lang === 'he' ? 'בוט חדש' : 'New Bot'}
              </button>
              <button type="button" className="bot-flow-btn bot-flow-btn-download" onClick={handleDownload}>
                {t.panel.download}
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
          {mode !== 'dashboard' && mode !== 'website' && (
            <>
              <button type="button" className="bot-flow-btn bot-flow-btn-save" onClick={handleSaveToStorage}>
                {t.panel.save}
              </button>
              <button type="button" className="bot-flow-btn bot-flow-btn-load" onClick={handleLoadFromStorage}>
                {t.panel.load}
              </button>
            </>
          )}
          {mode === 'dashboard' && onSave && null}
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
      {/* My Bots modal */}
      {mode === 'website' && showBotsModal && createPortal(
        <div className="bot-flow-email-modal-overlay" onClick={() => setShowBotsModal(false)}>
          <div className="bot-flow-email-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 className="bot-flow-email-modal-title" style={{ margin: 0 }}>
                {lang === 'he' ? '🤖 הבוטים שלי' : '🤖 My Bots'}
              </h3>
              <button type="button" onClick={() => setShowBotsModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {savedBots.length === 0 && (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0', fontSize: 14 }}>
                  {lang === 'he' ? 'אין בוטים שמורים עדיין. לחץ "שמור" כדי לשמור את הבוט הנוכחי.' : 'No saved bots yet. Click "Save" to save the current bot.'}
                </div>
              )}
              {savedBots.map((bot) => (
                <div
                  key={bot.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    border: currentBotId === bot.id ? '2px solid #2e6155' : '1.5px solid #e2e8f0',
                    borderRadius: 10, background: currentBotId === bot.id ? '#f0fdf4' : '#fff', cursor: 'pointer',
                  }}
                  onClick={() => handleLoadBot(bot)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{bot.name || 'ללא שם'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {new Date(bot.updatedAt || bot.createdAt).toLocaleString(lang === 'he' ? 'he-IL' : 'en-US')}
                      {' · '}{(bot.nodes || []).length} {lang === 'he' ? 'צמתים' : 'nodes'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); if (confirm(lang === 'he' ? 'למחוק את הבוט?' : 'Delete this bot?')) handleDeleteBot(bot.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16, padding: '4px 8px' }}
                    title={lang === 'he' ? 'מחק' : 'Delete'}
                  >🗑️</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, borderTop: '1px solid #e2e8f0', paddingTop: 12, flexWrap: 'wrap' }}>
              <button type="button" className="bot-flow-btn" onClick={handleNewBot} style={{ flex: 1, background: '#f0fdf4', borderColor: '#86efac', color: '#16a34a' }}>
                + {lang === 'he' ? 'בוט חדש' : 'New Bot'}
              </button>
              <label className="bot-flow-btn bot-flow-btn-load" style={{ flex: 1, margin: 0, cursor: 'pointer', textAlign: 'center' }}>
                <input type="file" accept=".json,application/json" onChange={handleLoadFromFile} style={{ display: 'none' }} />
                📂 {lang === 'he' ? 'טען מקובץ' : 'Load File'}
              </label>
              <button type="button" className="bot-flow-btn bot-flow-btn-load" onClick={() => setShowBotsModal(false)} style={{ flex: 1 }}>
                {lang === 'he' ? 'סגור' : 'Close'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* MediaPickerModal not available on website */}
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
  const organization = props.organization || null;

  if (props.initialFlow?.nodes) syncNodeIdCounter(props.initialFlow.nodes);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    props.initialFlow ? (props.initialFlow.nodes || []) : initialNodes
  );
  const [edges, setEdges, rawOnEdgesChange] = useEdgesState(
    props.initialFlow ? (props.initialFlow.edges || []) : initialEdges
  );
  const userConnectingRef = React.useRef(false);
  const flowLoadingRef = React.useRef(!!props.initialFlow);
  const onEdgesChange = React.useCallback((changes) => {
    const safe = changes.filter(c => c.type === 'select' || c.type === 'remove');
    const hadBlocked = changes.length > safe.length;
    if (safe.length > 0) rawOnEdgesChange(safe);
    if (hadBlocked) {
      setTimeout(() => setEdges(eds => [...eds]), 0);
    }
  }, [rawOnEdgesChange, setEdges]);

  useEffect(() => {
    if (props.onFlowChange) {
      props.onFlowChange(nodes, edges);
    }
  }, [nodes, edges, props.onFlowChange]);

  return (
    <BotFlowLangContext.Provider value={{ lang, t, organization }}>
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
            userConnectingRef={userConnectingRef}
            flowLoadingRef={flowLoadingRef}
          />
        </div>
      </ReactFlowProvider>
    </BotFlowLangContext.Provider>
  );
};

export default BotFlowBuilder;
