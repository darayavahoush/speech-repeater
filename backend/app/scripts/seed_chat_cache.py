"""
Populates the QA bank with a large set of question/answer pairs covering
the app, characters, languages, speech therapy, and encouragement.
No LLM is used anywhere — this bank + similarity matching IS the assistant.

Run with: python -m app.scripts.seed_chat_cache
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from app.services.chat_cache import store_answer

SEED_QA = [
    # --- Identity / greetings ---
    ("What is VaakSiddhi?", "VaakSiddhi is a speech practice app that helps kids practice saying words with fun animated friends! You listen, then try saying the word yourself."),
    ("Who are you?", "I'm your practice buddy! I'm here to help you learn new words and cheer you on while you practice."),
    ("What can you help with?", "I can tell you about the app, your character friends, and help cheer you on while you practice words!"),
    ("Hello", "Hi there! Ready to practice some words together?"),
    ("Hi", "Hello! I'm so happy to see you. Want to practice a word?"),
    ("What's your name?", "I go by the name of whichever friend you picked! Right now that's me."),
    ("Are you a robot?", "I'm your friendly practice buddy — pick a character and I'll take their personality!"),
    ("Are you real?", "I'm a helper inside the app, here to cheer you on while you practice speaking!"),

    # --- Characters ---
    ("Who is BOLT?", "BOLT is a brave space robot who loves helping kids practice new words!"),
    ("Tell me about BOLT", "BOLT is a brave space robot from the future who loves cheering you on while you practice!"),
    ("Who is ZARA?", "ZARA is a cheerful alien from planet Zorb who loves learning new words with you!"),
    ("Tell me about ZARA", "ZARA is a cheerful, sparkly alien from planet Zorb who's always excited to learn new words!"),
    ("Who is NOVA?", "NOVA is a calm and wise space guide who helps you practice at your own pace."),
    ("Tell me about NOVA", "NOVA is calm, wise, and gentle — a great friend if you like practicing slowly and thoughtfully."),
    ("Who is BEEP?", "BEEP is a tiny helper robot who is always excited to practice words with you!"),
    ("Tell me about BEEP", "BEEP is tiny, squeaky, and full of energy — always excited to learn new words!"),
    ("Who is ECHO?", "ECHO is an ancient computer from a distant galaxy who has heard every word in the universe!"),
    ("Tell me about ECHO", "ECHO is an ancient, wise computer from a distant galaxy with a mysterious, echoey voice."),
    ("Who is MIRA?", "MIRA is a friendly underwater robot who loves exploring words with you."),
    ("Tell me about MIRA", "MIRA is a bubbly, friendly underwater robot who loves exploring new words with you."),
    ("How many characters are there?", "There are six friends to choose from: BOLT, ZARA, NOVA, BEEP, ECHO, and MIRA!"),
    ("Which character should I pick?", "Pick whichever friend feels most fun to you! You can always switch to a different one later."),
    ("Can I change my character?", "Yes! You can pick a new friend anytime from the menu on the side of the screen."),
    ("How do I switch characters?", "Tap the little arrow on the side of the screen to open the menu, then pick a new character!"),
    ("Do the characters have different voices?", "Yes! Each character has their own unique voice and way of talking."),

    # --- Languages ---
    ("Can I change the language?", "Yes! You can switch between English, Hindi, and Kannada anytime from the side menu."),
    ("What languages does this app support?", "Right now VaakSiddhi supports English, Hindi, and Kannada!"),
    ("How do I switch languages?", "Open the side menu and tap the language you'd like to practice in!"),
    ("Can I practice in Hindi?", "Yes! Hindi is one of the languages you can pick to practice words in."),
    ("Can I practice in Kannada?", "Yes! Kannada is one of the languages you can pick to practice words in."),
    ("Do you speak other languages?", "I can talk with you in English, Hindi, or Kannada!"),

    # --- How the app works ---
    ("How do I practice a word?", "Listen to your character say the word, then tap the microphone and try saying it yourself!"),
    ("How does the app know if I said it right?", "The app listens carefully to how you said the word and gives you friendly feedback and a score."),
    ("What happens after I say the word?", "Your character will listen and give you encouraging feedback about how you did!"),
    ("What is drill mode?", "Drill mode is extra practice for tricky sounds, to help you get even better at them!"),
    ("How do I get into drill mode?", "If a sound needs a bit more practice, the app will start drill mode automatically to help you master it!"),
    ("Why do I keep getting the same word?", "If a sound is tricky, we practice it a bit more so you can master it — you're doing great by trying!"),
    ("How many times can I try a word?", "You can try as many times as you'd like! Every try helps you get better."),
    ("What if I get it wrong?", "That's okay! Getting words exactly right takes practice, and every attempt helps you improve."),
    ("Can my therapist see my progress?", "Your therapist or grown-up helper can guide your practice sessions with you."),
    ("How do I record my voice?", "Tap the microphone button and say the word clearly — then tap again to stop!"),
    ("The microphone isn't working", "Try checking that your device has given the app permission to use the microphone in your settings."),
    ("Can I hear the word again?", "Yes! Tap the 'Hear Voice' or play button to hear the word as many times as you like."),
    ("How do I pick a word to practice?", "Your therapist or grown-up helper can enter or choose a word for you to practice."),
    ("What is the practice screen?", "It's where you listen to your word and record yourself saying it!"),
    ("What is the result screen?", "After you record, this screen shows your score and encouraging feedback from your character!"),
    ("How do I go home?", "Tap the home icon in the side menu to go back to the start!"),
    ("How do I go to the next word?", "After finishing a word, look for the button to move on to your next word!"),

    # --- Feedback / scoring ---
    ("How does the app score pronunciation?", "The app checks pronunciation accuracy, loudness, pitch, speaking rate, and specific tricky sound pairs to give detailed feedback."),
    ("What does my score mean?", "Your score shows how close your pronunciation was to the target word — higher is closer, but every try counts!"),
    ("Why did I get a low score?", "A lower score just means that word needs a bit more practice — you're still doing great by trying!"),
    ("What is loudness?", "Loudness is how strongly or softly you said the word — not too quiet, not too loud is just right!"),
    ("What is pitch?", "Pitch is how high or low your voice sounds while speaking."),
    ("What is speaking rate?", "Speaking rate is how fast or slow you said the word."),

    # --- Speech / pronunciation help ---
    ("Why is this word hard to say?", "Some words have tricky sounds that take extra practice — that's totally normal! Let's try it slowly together."),
    ("How can I say this word better?", "Try saying it slowly first, then a little faster each time. Watching how your mouth moves in a mirror can help too!"),
    ("What if I can't make a sound?", "That's okay, some sounds take lots of practice. Your therapist can help you find the best way to make it."),
    ("Why do some words sound different in Hindi?", "Hindi has some special sounds that don't exist in English, like tongue-tip sounds that need extra practice!"),
    ("What's the difference between त and ट?", "Those are both fun tricky sounds! त is made with your tongue behind your teeth, and ट is made with your tongue curled back a bit."),
    ("What's the difference between क and ख?", "क and ख sound similar, but ख has a little puff of air right after it!"),
    ("How do I make the 'r' sound?", "Try curling your tongue up gently behind your top teeth without touching them — it takes practice, so keep trying!"),
    ("Why does my mouth feel tired after practicing?", "Practicing new sounds uses muscles you don't always use — feeling a little tired means you're working hard!"),
    ("What are phonemes?", "Phonemes are the individual sounds that make up words — like the 'buh' sound at the start of 'ball'!"),
    ("Why do I mix up sounds?", "Mixing up similar-sounding sounds is really common while learning — practice helps your mouth remember the difference!"),

    # --- Encouragement / emotional support ---
    ("I don't want to practice anymore", "That's okay, taking breaks is important too! We can come back to practicing whenever you're ready."),
    ("This is too hard", "I know it feels hard right now, but you're doing better than you think! Let's try one small step at a time."),
    ("I'm bad at this", "You're not bad at this at all — you're learning, and learning takes practice! Every try makes you stronger."),
    ("Am I doing good?", "You're doing wonderfully! I'm proud of you for trying your best."),
    ("Can we take a break?", "Of course! Practice is more fun when you're not tired. Let's take a little break."),
    ("I'm frustrated", "It's okay to feel frustrated sometimes. You're working hard, and that matters more than getting it perfect."),
    ("I'm tired", "That makes sense, practicing takes energy! Let's rest and come back when you're ready."),
    ("I don't like this word", "That's okay! Every word gets easier the more you practice — you've got this."),
    ("Will I ever get better?", "Yes! Every single practice session helps, even the tricky ones. You're already improving!"),
    ("I got it right!", "Yay! That's amazing, I'm so proud of you!"),
    ("I did it!", "You did it! Great job, that was awesome!"),
    ("Thank you", "You're so welcome! Keep up the great work!"),

    # --- For parents / therapists ---
    ("Is this app a replacement for speech therapy?", "No — VaakSiddhi is a practice tool meant to support therapy, not replace guidance from a licensed speech-language pathologist."),
    ("What ages is this app good for?", "VaakSiddhi is designed for children working with speech-language professionals on pronunciation practice."),
    ("Does this app work for autism communication support?", "Yes, VaakSiddhi is designed with autism-friendly considerations like predictable structure and adaptive encouragement."),
    ("Who made this app?", "VaakSiddhi was built to help children practice speech in a fun, supportive way alongside their therapists."),
    ("Is my data safe?", "Your practice sessions are used to help track progress and give you better feedback."),
    ("How do I contact support?", "Please reach out to whoever set up the app for you — your therapist or grown-up helper — for any technical questions."),
]

def main():
    print(f"Seeding {len(SEED_QA)} Q&A pairs into chat bank...")
    for question, answer in SEED_QA:
        store_answer(question, answer)
    print(f"Done. {len(SEED_QA)} entries seeded.")

if __name__ == "__main__":
    main()
