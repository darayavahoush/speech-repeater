// Single source of truth for the Privacy Policy and Terms of Service.
// Used by the in-app LegalPage AND by scripts/generate-legal.mjs, which builds
// static /privacy.html and /terms.html so crawlers (Google's OAuth verification)
// can read them without running JavaScript.
export const CONTACT_EMAIL = "admin@manaslearning.com";
export const EFFECTIVE_DATE = "29 September 2026";
export const LAST_UPDATED = "29 September 2026";
export const APP_URL = "https://vaakify.manaslearning.com";

export const LEGAL = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "Vaakify (\"Vaakify\", \"we\", \"us\") is a speech-practice app for children, available at " + APP_URL + ". This policy explains what information we collect, how we use it, who we share it with, how long we keep it, and the choices you have. It applies to the Vaakify website and app, including when you sign in with Google.",
    sections: [
      {
        title: "Information we collect",
        paras: ["Depending on how you sign up and use Vaakify, we collect:"],
        list: [
          "Account information: your name, email address, and (optionally) a mobile number. If you sign up with a password, we store only a securely hashed version of it, never the password itself.",
          "Child profile and practice data: the words your child practises, the language and practice character you choose, pronunciation scores and attempt history, and your free-trial or subscription status.",
          "Voice recordings: when your child records a word, the audio is sent to our servers to generate pronunciation feedback. See \"Voice recordings\" below.",
          "Basic technical data: standard server logs (such as IP address and request time) that our hosting provider generates to keep the service running and secure.",
        ],
      },
      {
        title: "Google user data (Sign in with Google)",
        paras: [
          "If you choose \"Sign in with Google\", Vaakify receives only the basic profile information contained in Google's sign-in ID token: your name, your email address (and whether Google has verified it), and your Google account's unique identifier.",
          "We do not request access to your Gmail, Google Drive, Calendar, Contacts, or any other Google service, and we do not use any Google API scopes beyond basic sign-in (openid, email, profile).",
          "How we use it: to create your Vaakify account, recognise you when you sign in again, and contact you about your account (for example, verification or service notices). Your Google account identifier is used only to link future Google sign-ins to your existing Vaakify account.",
          "How we share it: we do not sell, rent, or share Google user data with third parties, and we do not use it for advertising, profiling, or to train AI or machine-learning models. It is processed only by the infrastructure providers described under \"Who we share data with\", solely to operate the service.",
          "Vaakify's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.",
        ],
      },
      {
        title: "Voice recordings",
        paras: [
          "Recordings are used only to analyse pronunciation and give real-time feedback. They are processed in temporary storage and deleted immediately after analysis; we do not keep a permanent copy of your child's voice, and we do not use recordings to train models or for any other purpose. What we keep is the result of the attempt (the word, whether it was pronounced correctly, and the time), not the audio.",
        ],
      },
      {
        title: "Children's privacy",
        paras: [
          "Vaakify is designed to be set up and supervised by a parent, guardian, or therapist. Accounts must be created by an adult, and we do not knowingly collect personal information directly from a child without a parent or guardian creating and controlling the account. We collect only what is needed for practice and progress tracking, we show no third-party advertising, and we do not sell children's data. A parent or guardian can review or delete their child's data at any time (see \"Your choices\").",
        ],
      },
      {
        title: "How we use your information",
        paras: ["We use the information we collect only to:"],
        list: [
          "create and secure your account and let you sign in;",
          "provide the core features of the app: pronunciation feedback, progress tracking, and tailoring practice to your child's language and needs;",
          "send verification codes and essential service messages;",
          "manage your free trial or subscription;",
          "keep the service secure, prevent abuse, and fix problems.",
        ],
      },
      {
        title: "Who we share data with",
        paras: [
          "We do not sell your data or your child's data. We share information only with service providers that process it on our behalf to run Vaakify, and who are not permitted to use it for their own purposes:",
        ],
        list: [
          "Cloud hosting and database services (Microsoft Azure, Central India region) to run the app and store account and practice data;",
          "Email and SMS delivery providers, to send verification codes;",
          "Google, to verify your Google sign-in token when you use Sign in with Google.",
        ],
        after: "We may also disclose information if required by law or to protect the rights, safety, and security of our users and the service.",
      },
      {
        title: "Data storage and security",
        paras: [
          "Data is stored in a managed cloud database. Traffic between your device and Vaakify is encrypted in transit using HTTPS, passwords are stored only as hashes, and access to production systems is restricted. No system is perfectly secure, but we work to protect your information and will act promptly if we learn of a problem.",
        ],
      },
      {
        title: "Data retention and deletion",
        paras: [
          "We keep account and progress data for as long as your account is active. When you delete your account, we permanently delete your account record and all associated practice history. Voice recordings are not retained beyond the moment of analysis.",
        ],
      },
      {
        title: "Your choices and rights",
        paras: ["You can, at any time:"],
        list: [
          "view and update your account details in Settings;",
          "delete your account and all associated data from Settings, or by emailing " + CONTACT_EMAIL + " from the address on your account (we will delete it within 30 days);",
          "ask us what data we hold about you or your child, or ask us to correct it;",
          "revoke Vaakify's access from your Google Account at myaccount.google.com/permissions. This stops Google sign-in from working for Vaakify; it does not by itself delete your Vaakify account, so please also request deletion if you want your data removed.",
        ],
      },
      {
        title: "International use",
        paras: [
          "Vaakify is operated from India and data is hosted in the Microsoft Azure Central India region. If you use Vaakify from another country, your information will be transferred to and processed in India.",
        ],
      },
      {
        title: "Changes to this policy",
        paras: [
          "We may update this policy as the app evolves. When we make material changes we will update the date at the top of this page and, where appropriate, notify you in the app or by email.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro:
      "These terms govern your use of Vaakify, available at " + APP_URL + ". Please read them together with our Privacy Policy.",
    sections: [
      { title: "Acceptance of terms", paras: ["By using Vaakify, you agree to these terms. If you don't agree, please don't use the app."] },
      {
        title: "What Vaakify is, and isn't",
        paras: [
          "Vaakify is a speech-practice tool designed to support pronunciation practice through interactive, phoneme-level feedback. It is not a medical device, and it does not diagnose, treat, or replace professional speech-language therapy or medical advice. Please consult a qualified speech-language pathologist about your child's individual needs.",
        ],
      },
      {
        title: "Who can use Vaakify",
        paras: [
          "Accounts must be created and managed by a parent or legal guardian, or by an adult acting for them, on behalf of a child. By creating an account, you confirm you have the authority to do so and to consent to the app's use on the child's behalf.",
        ],
      },
      {
        title: "Your account",
        paras: [
          "You're responsible for keeping your account credentials secure and for all activity under your account. Let us know right away if you believe your account has been compromised.",
        ],
      },
      {
        title: "Free trial and subscriptions",
        paras: [
          "Vaakify may offer a free trial period followed by a paid subscription. Pricing and billing terms will be presented clearly before any charge. You can cancel at any time; see Plans & pricing in the app for current details.",
        ],
      },
      {
        title: "Acceptable use",
        paras: [
          "Please don't use Vaakify to upload harmful, abusive, or illegal content, attempt to disrupt or reverse-engineer the service, or use it in any way inconsistent with its purpose as a children's speech-practice tool.",
        ],
      },
      {
        title: "Third-party content",
        paras: [
          "The app uses pictograms from ARASAAC (arasaac.org), the property of the Government of Aragón (Spain), authored by Sergio Palao and used under the CC BY-NC-SA licence.",
        ],
      },
      {
        title: "Disclaimer and limitation of liability",
        paras: [
          "Vaakify is provided \"as is\", without warranties of any kind. To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the app.",
        ],
      },
      {
        title: "Changes to these terms",
        paras: ["We may update these terms from time to time. Continued use of the app after changes means you accept the updated terms."],
      },
      { title: "Governing law", paras: ["These terms are governed by the laws of India."] },
    ],
  },
};
