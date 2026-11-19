// Demo conversations for the schools landing page (parents <-> school staff on WhatsApp).
//
// The flows mirror a real, working Gambot school deployment (main menu bot, FAQ, digital forms and signatures,
// staff-request routing) but are fully white-labelled: no school name, e-mail, phone, link or staff name from a
// real customer. Answers in the FAQ are generic EXAMPLES - every school writes its own.
//
// Step grammar (same as insuranceFlows.js, played back as a chat by the shared <Chat/>):
//   { bot: "text" }                                    bot sends a message
//   { bot: "text", choices: [{ label, then: [...] }] } bot sends a message with quick-reply buttons
//   { bot: "text", ask: "sample answer", ai: true }    bot asks a free-text question (ai = AI validates the answer)
// Tokens {{key}} are replaced by the example values in `vars` and highlighted; *text* is bold.

const BACK_TO_MENU = { bot: "אפשר לחזור לתפריט הראשי בכל עת 💚" };

/* ───────────── 1. main menu ───────────── */

function scheduleBranch() {
  const link = (what) => ({
    bot: `ניתן לצפות ב${what} בקישור הבא:\n\nhttps://school.example/${what.replace(/\s/g, "-")}`,
  });
  return {
    label: 'לו״ז',
    then: [
      {
        bot: "מה תרצו לדעת?",
        choices: [
          { label: "חופשות משרד החינוך", then: [link("חופשות משרד החינוך"), BACK_TO_MENU] },
          { label: "לוח מבחנים", then: [link("לוח מבחנים"), BACK_TO_MENU] },
          { label: "לוח אירועים בית ספרי", then: [link("לוח אירועים בית ספרי"), BACK_TO_MENU] },
        ],
      },
    ],
  };
}

function formsBranch() {
  const sign = (label) => ({
    label,
    then: [
      { bot: `מצוין. הנה קישור ל${label}, למילוי ולחתימה דיגיטלית מהנייד:\n\nhttps://school.example/sign` },
      { bot: "✅ קיבלנו את החתימה. עותק חתום נשלח אליך למייל ונשמר בתיק התלמיד." },
      BACK_TO_MENU,
    ],
  });
  return {
    label: "נהלים וטפסים",
    then: [
      {
        bot: "נא בחרו את האפשרות המתאימה ביותר",
        choices: [sign("הצהרת בריאות"), sign("ויתור סודיות"), sign("הגנת פרטיות"), sign("הסכמה להעברת מידע ברשת")],
      },
    ],
  };
}

function faqBranch() {
  const qa = (label, answer) => ({ label, then: [{ bot: answer }, BACK_TO_MENU] });
  return {
    label: "תשובות לשאלות נפוצות",
    then: [
      {
        bot: "על מה תרצו לשאול?",
        choices: [
          {
            label: "קוד לבוש",
            then: [
              {
                bot: "איזו שאלה?",
                choices: [
                  qa("האם מותר איפור?", "איפור קל ועדין מותר. איפור בולט אינו מותר בשעות הלימודים."),
                  qa("האם מותר פירסינג?", "בהתאם לנהלי בית הספר, חל איסור על פירסינג באזור הפנים."),
                ],
              },
            ],
          },
          {
            label: "מבחנים ונהלים",
            then: [
              {
                bot: "איזו שאלה?",
                choices: [
                  qa("איך ניגשים למועד ב׳?", "תלמיד שזכאי למועד ב׳ מקבל הודעה מהמורה המקצועי. את הבקשה מגישים דרך טופס דיגיטלי."),
                  qa("שיפור ציון", "פעם בשנה אפשר לבחור מקצוע אחד לשיפור ציון, בהתאם לתנאי בית הספר."),
                ],
              },
            ],
          },
          {
            label: "בריאות וחירום",
            then: [
              {
                bot: "איזו שאלה?",
                choices: [
                  qa("תלמיד לא מרגיש טוב", "פונים למזכירות או לאחות בית הספר. נעדכן את ההורים בהקדם."),
                  qa("איפה המקלטים?", "המקלטים מותאמים לקליטת כלל התלמידים. מפת המקלטים נשלחת להורים בתחילת השנה."),
                ],
              },
            ],
          },
          {
            label: "זמנים ותיאומים",
            then: [
              {
                bot: "איזו שאלה?",
                choices: [
                  qa("מתי מסתיימים הלימודים בערב חג?", "בערבי חג ובימי שישי הלימודים מסתיימים בשעה 11:45."),
                  qa("איך מתאמים פגישה?", "אפשר לפתוח פנייה לצוות החינוכי מהתפריט הראשי, והמחנכת תחזור עם מועד."),
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

function releaseBranch() {
  return {
    label: "טופס שחרור",
    then: [
      { bot: "מצורף טופס דיגיטלי לבקשה לשחרור תלמיד/ה 👇\n\nhttps://school.example/forms/release" },
      { bot: "שם התלמיד/ה וכיתה?", ask: "נועם כהן, ח׳ 2" },
      { bot: "באיזו שעה הילד/ה ישוחרר/ת, ומי אוסף/ת?", ask: "ב-11:30, אמא" },
      { bot: "✅ הבקשה התקבלה ונשלחה למזכירות. תקבלו אישור בהודעה." },
      BACK_TO_MENU,
    ],
  };
}

function staffBranch() {
  return {
    label: "יצירת קשר צוות חינוכי",
    then: [
      { bot: "לפניכם טופס דיגיטלי לפתיחת פנייה לצוות החינוכי:\n\nhttps://school.example/forms/staff" },
      { bot: "למי הפנייה, ומה הנושא?", ask: "למחנכת, אני רוצה לתאם שיחה על המעבר לכיתה ט׳" },
      { bot: "✅ הפנייה נשלחה למחנכת. נחזור אליך בהקדם." },
      BACK_TO_MENU,
    ],
  };
}

function urgentBranch() {
  return {
    label: "פנייה דחופה",
    then: [
      { bot: "מצורף קישור לטופס דיווח לפנייה דחופה:\n\nhttps://school.example/forms/urgent" },
      { bot: "מה קרה? נא לתאר בקצרה.", ask: "הילד חזר הביתה עם חבלה ואני רוצה לדבר היום עם המחנך" },
      { bot: "הפנייה סומנה כדחופה ונשלחה ישירות לצוות. מישהו יחזור אליכם בהקדם 🙏" },
    ],
  };
}

function secretaryBranch() {
  return {
    label: "יצירת קשר מזכירות",
    then: [{ bot: "טלפון המזכירות: 03-0000000\nמייל: office@school.example\nשעות מענה: א׳-ה׳ 8:00-15:00" }, BACK_TO_MENU],
  };
}

/* ───────────── 2. tabs ───────────── */

const PARENT_VARS = { name: "מיכל", school: "בית הספר" };

export const SCHOOL_TABS = [
  {
    id: "menu",
    icon: "📲",
    label: "תפריט ראשי להורים",
    blurb: "ההורה כותב ״היי״ למספר של בית הספר ומקבל תפריט: לו״ז, טפסים, שאלות נפוצות ופנייה לצוות. בלי להמתין למענה ובלי להציף את המורים.",
    steps: [
      { title: "ההורה כותב ״היי״", desc: "מהמספר הרשמי של בית הספר, באותה שיחת וואטסאפ שהוא מכיר." },
      { title: "בוחר נושא בלחיצה", desc: "לוח מבחנים, חופשות, אירועים, טפסים, שאלות נפוצות או פנייה לצוות." },
      { title: "מקבל תשובה מיד", desc: "קישור, מסמך או תשובה מוכנה. רק מה שבאמת צריך אדם מגיע לצוות." },
    ],
    agentCard: {
      title: "מה הצוות רואה בגמבוט",
      items: [
        "כל שיחה נשמרת בתיבה משותפת ולא בנייד האישי של המורה",
        "כל הורה מזוהה בשם ובמספר, וההיסטוריה שלו נשמרת",
        "פניות שדורשות אדם מועברות לצוות עם כל ההקשר",
      ],
    },
    vars: PARENT_VARS,
    opening: `היי {{name}} 👋
שמחים שפניתם אל {{school}}.

איך נוכל לעזור לך היום?`,
    start(opening) {
      return [
        {
          bot: opening,
          choices: [scheduleBranch(), formsBranch(), faqBranch(), staffBranch(), releaseBranch(), urgentBranch(), secretaryBranch()],
        },
      ];
    },
  },
  {
    id: "forms",
    icon: "✍️",
    label: "טפסים וחתימה דיגיטלית",
    blurb: "הצהרות בריאות, ויתור סודיות, הגנת פרטיות, אישורים וטיולים. ההורה חותם מהנייד, ובית הספר מקבל עותק חתום בלי לרדוף אחרי ניירות.",
    steps: [
      { title: "בית הספר מכין תבנית פעם אחת", desc: "טופס עם שדות למילוי וחתימה, בעיצוב של בית הספר." },
      { title: "ההורה מקבל קישור בוואטסאפ", desc: "ממלא וחותם בנייד. המסמך החתום נשמר ומגיע גם אליו למייל." },
      { title: "המזכירות רואה מי חתם", desc: "מסמכים שמולאו מועברים אוטומטית לתיבת המזכירות." },
    ],
    agentCard: {
      title: "מה המזכירות רואה בגמבוט",
      items: [
        "מסמך חתום, עם תאריך ושעה, שמור ומשויך להורה",
        "אפשר לראות מי עוד לא חתם ולשלוח לו תזכורת בלחיצה",
        "בלי הדפסות, סריקות או ילקוטים ששוכחים",
      ],
    },
    vars: PARENT_VARS,
    opening: `היי {{name}} 👋
לקראת הטיול השנתי צריך את חתימתך על אישור יציאה והצהרת בריאות.

מה תרצו לעשות?`,
    start(opening) {
      return [
        {
          bot: opening,
          choices: [
            {
              label: "למלא ולחתום עכשיו",
              then: [
                { bot: "הנה הקישור לטופס, למילוי ולחתימה מהנייד:\n\nhttps://school.example/sign" },
                { bot: "✅ קיבלנו את החתימה. עותק חתום נשלח אליך למייל.\n\nתודה, {{name}}!" },
              ],
            },
            {
              label: "יש לי שאלה על הטופס",
              then: [
                { bot: "בכיף, מה השאלה?", ask: "האם צריך לציין אלרגיות גם אם הן לא חמורות?" },
                { bot: "קיבלנו. המחנכת תחזור אליך עם תשובה, והטופס נשאר זמין לך 🙏" },
              ],
            },
          ],
        },
      ];
    },
  },
  {
    id: "staff",
    icon: "👩‍🏫",
    label: "פנייה לצוות החינוכי",
    blurb: "במקום הודעות פרטיות למורה בשעות הערב: ההורה ממלא פנייה, היא מגיעה למורה הנכון, ובית הספר דואג שתהיה חזרה.",
    steps: [
      { title: "ההורה פותח פנייה בטופס", desc: "למי, באיזה נושא ומה דחוף. שדות קבועים, בלי משפטים שאבדו בצ׳אט." },
      { title: "המורה מקבל מייל ומשימה", desc: "הפנייה מגיעה למורה או למחנכת הנכונים, ומסומנת לפי דחיפות." },
      { title: "אחרי כמה ימים ההורה נשאל על הטיפול", desc: "הבוט שואל אם הפנייה טופלה, והמשוב חוזר לצוות." },
    ],
    agentCard: {
      title: "מה המורה והצוות רואים בגמבוט",
      items: [
        "פנייה אחת מסודרת במקום עשרות הודעות פרטיות",
        "משימה לטיפול עם תאריך יעד, ופנייה דחופה מסומנת בנפרד",
        "משוב ההורה אחרי הטיפול מגיע ליחידה הרלוונטית",
      ],
    },
    vars: PARENT_VARS,
    opening: `שלום {{name}},
אפשר לפתוח פנייה לצוות החינוכי של {{school}}.

מה הסוג של הפנייה?`,
    start(opening) {
      return [
        {
          bot: opening,
          choices: [
            {
              label: "פנייה רגילה",
              then: [
                { bot: "למי הפנייה, ומה הנושא?", ask: "למחנכת, אני רוצה לתאם שיחה על המעבר לכיתה ט׳", ai: true },
                { bot: "✅ הפנייה נשלחה למחנכת ונפתחה לה משימה. נחזור אליך בהקדם." },
                { bot: "(כמה ימים אחרי)\n\nהיי {{name}}, רצינו לוודא: האם הפנייה שלך טופלה?", choices: [
                  { label: "כן, תודה", then: [{ bot: "מעולה, שמחים לשמוע 💚" }] },
                  { label: "עדיין לא", then: [{ bot: "מצטערים. העברנו שוב לצוות, וקבעו לכם חזרה היום 🙏" }] },
                ] },
              ],
            },
            {
              label: "פנייה דחופה",
              then: [
                { bot: "מה קרה? נא לתאר בקצרה.", ask: "הילד חזר הביתה עם חבלה ואני רוצה לדבר היום עם המחנך", ai: true },
                { bot: "הפנייה סומנה כדחופה ונשלחה ישירות לצוות. מישהו יחזור אליכם בהקדם 🙏" },
              ],
            },
          ],
        },
      ];
    },
  },
];
