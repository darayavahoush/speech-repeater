# Complete phoneme library with mouth positions, tips, and example words

PHONEME_DATA = {
    # ─── CONSONANTS ───────────────────────────────────────────────
    "B": {
        "ipa": "b",
        "name": "b sound",
        "example_word": "ball",
        "tip": "Close your lips softly. Let your voice buzz. Pop them open.",
        "tongue": "Tongue rests low and relaxed — it isn't used for this sound.",
        "mouth_shape": "lips_closed_puff",
        "acoustic_target": {"min_duration_ms": 100, "voiced": True},
        "common_errors": ["P", "W", "M"],
        "category": "stop"
    },
    "P": {
        "ipa": "p",
        "name": "p sound",
        "example_word": "pen",
        "tip": "Close your lips softly. Puff air out. No voice.",
        "tongue": "Tongue rests low and relaxed — it isn't used for this sound.",
        "mouth_shape": "lips_closed_puff_voiceless",
        "acoustic_target": {"min_duration_ms": 100, "voiced": False},
        "common_errors": ["B", "F"],
        "category": "stop"
    },
    "M": {
        "ipa": "m",
        "name": "m sound",
        "example_word": "moon",
        "tip": "Close your lips. Hum through your nose.",
        "tongue": "Tongue rests low and relaxed — it isn't used for this sound.",
        "mouth_shape": "lips_closed_hum",
        "acoustic_target": {"min_duration_ms": 150, "voiced": True},
        "common_errors": ["B", "N"],
        "category": "nasal"
    },
    "D": {
        "ipa": "d",
        "name": "d sound",
        "example_word": "dog",
        "tip": "Touch your tongue tip behind your top teeth. Let your voice buzz.",
        "tongue": "Tongue tip touches the ridge just behind your top teeth.",
        "mouth_shape": "tongue_tip_up",
        "acoustic_target": {"min_duration_ms": 100, "voiced": True},
        "common_errors": ["T", "G", "N"],
        "category": "stop"
    },
    "T": {
        "ipa": "t",
        "name": "t sound",
        "example_word": "tree",
        "tip": "Touch your tongue tip behind your top teeth. Puff air out. No voice.",
        "tongue": "Tongue tip touches the ridge just behind your top teeth.",
        "mouth_shape": "tongue_tip_up_voiceless",
        "acoustic_target": {"min_duration_ms": 100, "voiced": False},
        "common_errors": ["D", "K"],
        "category": "stop"
    },
    "N": {
        "ipa": "n",
        "name": "n sound",
        "example_word": "nose",
        "tip": "Touch your tongue tip behind your top teeth. Hum through your nose.",
        "tongue": "Tongue tip touches the ridge just behind your top teeth.",
        "mouth_shape": "tongue_tip_up_hum",
        "acoustic_target": {"min_duration_ms": 150, "voiced": True},
        "common_errors": ["M", "D"],
        "category": "nasal"
    },
    "G": {
        "ipa": "ɡ",
        "name": "g sound",
        "example_word": "goat",
        "tip": "Lift the back of your tongue. Let your voice buzz.",
        "tongue": "Back of your tongue touches the roof of your mouth.",
        "mouth_shape": "tongue_back_up",
        "acoustic_target": {"min_duration_ms": 100, "voiced": True},
        "common_errors": ["D", "K"],
        "category": "stop"
    },
    "K": {
        "ipa": "k",
        "name": "k sound",
        "example_word": "cat",
        "tip": "Lift the back of your tongue. Puff air out. No voice.",
        "tongue": "Back of your tongue touches the roof of your mouth.",
        "mouth_shape": "tongue_back_up_voiceless",
        "acoustic_target": {"min_duration_ms": 100, "voiced": False},
        "common_errors": ["T", "G"],
        "category": "stop"
    },
    "F": {
        "ipa": "f",
        "name": "f sound",
        "example_word": "fish",
        "tip": "Rest your top teeth on your bottom lip. Blow air out slowly.",
        "tongue": "Tongue rests low and relaxed behind your bottom teeth.",
        "mouth_shape": "teeth_on_lip",
        "acoustic_target": {"min_duration_ms": 150, "voiced": False},
        "common_errors": ["P", "TH", "V"],
        "category": "fricative"
    },
    "V": {
        "ipa": "v",
        "name": "v sound",
        "example_word": "van",
        "tip": "Rest your top teeth on your bottom lip. Blow air and buzz your voice.",
        "tongue": "Tongue rests low and relaxed behind your bottom teeth.",
        "mouth_shape": "teeth_on_lip_voiced",
        "acoustic_target": {"min_duration_ms": 150, "voiced": True},
        "common_errors": ["B", "F", "W"],  # V/W merge is standard in Indian English
        "category": "fricative"
    },
    "S": {
        "ipa": "s",
        "name": "s sound",
        "example_word": "sun",
        "tip": "Put your teeth close together. Push air through the little gap.",
        "tongue": "Tongue tip stays close to the ridge behind your top teeth, without touching.",
        "mouth_shape": "teeth_together_hiss",
        "acoustic_target": {"min_duration_ms": 150, "voiced": False},
        "common_errors": ["TH", "SH", "Z"],
        "category": "fricative"
    },
    "Z": {
        "ipa": "z",
        "name": "z sound",
        "example_word": "zebra",
        "tip": "Put your teeth close together. Push air through and buzz your voice.",
        "tongue": "Tongue tip stays close to the ridge behind your top teeth, without touching.",
        "mouth_shape": "teeth_together_hiss_voiced",
        "acoustic_target": {"min_duration_ms": 150, "voiced": True},
        "common_errors": ["S", "D"],
        "category": "fricative"
    },
    "SH": {
        "ipa": "ʃ",
        "name": "sh sound",
        "example_word": "ship",
        "tip": "Round your lips. Push them a little forward. Blow air out slow.",
        "tongue": "Tongue pulls back a little, with the body raised toward the roof of your mouth.",
        "mouth_shape": "lips_rounded_push",
        "acoustic_target": {"min_duration_ms": 150, "voiced": False},
        "common_errors": ["S", "CH"],
        "category": "fricative"
    },
    "CH": {
        "ipa": "tʃ",
        "name": "ch sound",
        "example_word": "chair",
        "tip": "Touch your tongue to the roof of your mouth. Release with a soft SH.",
        "tongue": "Tongue touches the roof of your mouth, then pulls back like SH.",
        "mouth_shape": "lips_rounded_push",
        "acoustic_target": {"min_duration_ms": 150, "voiced": False},
        "common_errors": ["SH", "T"],
        "category": "affricate"
    },
    "JH": {
        "ipa": "dʒ",
        "name": "j sound",
        "example_word": "jump",
        "tip": "Round your lips. Push them a little forward. Blow air and buzz.",
        "tongue": "Tongue touches the roof of your mouth, then pulls back like SH — with voice.",
        "mouth_shape": "lips_rounded_push_voiced",
        "acoustic_target": {"min_duration_ms": 150, "voiced": True},
        "common_errors": ["CH", "D"],
        "category": "affricate"
    },
    "L": {
        "ipa": "l",
        "name": "l sound",
        "example_word": "lamp",
        "tip": "Touch your tongue tip up behind your top teeth. Let air flow past the sides.",
        "tongue": "Tongue tip touches the ridge behind your top teeth, letting air flow past the sides.",
        "mouth_shape": "tongue_tip_up_sides_open",
        "acoustic_target": {"min_duration_ms": 150, "voiced": True},
        "common_errors": ["W", "R", "Y"],
        "category": "liquid"
    },
    "R": {
        "ipa": "r",
        "name": "r sound",
        "example_word": "rabbit",
        "tip": "Round your lips a little. Curl your tongue back. Don't touch anything.",
        "tongue": "Tongue curls back toward the roof of your mouth without touching anything.",
        "mouth_shape": "tongue_curled_lips_rounded",
        "acoustic_target": {"min_duration_ms": 150, "voiced": True},
        "common_errors": ["W", "L"],
        "category": "liquid"
    },
    "W": {
        "ipa": "w",
        "name": "w sound",
        "example_word": "water",
        "tip": "Round your lips into a small tight circle, like blowing a kiss.",
        "tongue": "Back of your tongue lifts slightly; the front stays low.",
        "mouth_shape": "lips_rounded_open",
        "acoustic_target": {"min_duration_ms": 100, "voiced": True},
        "common_errors": ["V", "B"],
        "category": "glide"
    },
    "Y": {
        "ipa": "j",
        "name": "y sound",
        "example_word": "yellow",
        "tip": "Smile a little. Lift your tongue high. Slide into the next sound.",
        "tongue": "Tongue lifts high toward the roof of your mouth.",
        "mouth_shape": "tongue_high_slide",
        "acoustic_target": {"min_duration_ms": 100, "voiced": True},
        "common_errors": ["JH", "L"],
        "category": "glide"
    },
    "HH": {
        "ipa": "h",
        "name": "h sound",
        "example_word": "house",
        "tip": "Open your mouth gently. Breathe out. No buzzing.",
        "tongue": "Tongue rests low and relaxed — it isn't used for this sound.",
        "mouth_shape": "mouth_open_breathe",
        "acoustic_target": {"min_duration_ms": 100, "voiced": False},
        "common_errors": [],
        "category": "fricative"
    },
    "TH": {
        "ipa": "θ",
        "name": "th sound",
        "example_word": "thumb",
        "tip": "Let your tongue tip peek out between your teeth. Blow air out gently.",
        "tongue": "Tongue tip pokes out gently between your teeth.",
        "mouth_shape": "tongue_between_teeth",
        "acoustic_target": {"min_duration_ms": 150, "voiced": False},
        "common_errors": ["S", "F"],  # D substitution is standard Indian English variant, not flagged
        "category": "fricative"
    },
    "DH": {
        "ipa": "ð",
        "name": "th sound (this)",
        "example_word": "this",
        "tip": "Let your tongue tip peek out between your teeth. Buzz your voice.",
        "tongue": "Tongue tip pokes out gently between your teeth — with voice.",
        "mouth_shape": "tongue_between_teeth_voiced",
        "acoustic_target": {"min_duration_ms": 150, "voiced": True},
        "common_errors": ["TH", "D", "Z"],
        "category": "fricative"
    },
    "NG": {
        "ipa": "ŋ",
        "name": "ng sound",
        "example_word": "sing",
        "tip": "Lift the back of your tongue. Hum through your nose.",
        "tongue": "Back of your tongue touches the roof of your mouth while air goes through your nose.",
        "mouth_shape": "tongue_back_up_hum",
        "acoustic_target": {"min_duration_ms": 150, "voiced": True},
        "common_errors": ["N", "G"],
        "category": "nasal"
    },
    "ZH": {
        "ipa": "ʒ",
        "name": "zh sound",
        "example_word": "measure",
        "tip": "Round your lips a little. Buzz your voice while you blow air.",
        "tongue": "Tongue pulls back a little, like SH — with voice.",
        "mouth_shape": "lips_rounded_push_voiced_zh",
        "acoustic_target": {"min_duration_ms": 150, "voiced": True},
        "common_errors": ["SH", "JH"],
        "category": "fricative"
    },
    # ─── VOWELS ───────────────────────────────────────────────────
    "AE": {
        "ipa": "æ",
        "name": "a sound (cat)",
        "example_word": "cat",
        "tip": "Open your mouth wide.",
        "tongue": "Tongue is low and pushed toward the front of your mouth.",
        "mouth_shape": "mouth_wide_open",
        "acoustic_target": {"f1_range": [700, 1000], "f2_range": [1500, 2000]},
        "common_errors": ["EH", "AH"],
        "category": "vowel"
    },
    "AO": {
        "ipa": "ɔ",
        "name": "aw sound (ball)",
        "example_word": "ball",
        "tip": "Round your lips into a big open circle.",
        "tongue": "Tongue is low and pulled toward the back of your mouth.",
        "mouth_shape": "lips_rounded_wide",
        "acoustic_target": {"f1_range": [500, 800], "f2_range": [700, 1100]},
        "common_errors": ["AH", "UH"],
        "category": "vowel"
    },
    "EH": {
        "ipa": "ɛ",
        "name": "e sound (bed)",
        "example_word": "bed",
        "tip": "Open your mouth halfway.",
        "tongue": "Tongue is at middle height, pushed toward the front.",
        "mouth_shape": "mouth_half_open",
        "acoustic_target": {"f1_range": [500, 700], "f2_range": [1700, 2100]},
        "common_errors": ["AE", "IH"],
        "category": "vowel"
    },
    "IH": {
        "ipa": "ɪ",
        "name": "i sound (sit)",
        "example_word": "sit",
        "tip": "Open your mouth just a little. Small smile.",
        "tongue": "Tongue is high and toward the front, but relaxed.",
        "mouth_shape": "mouth_nearly_closed_smile",
        "acoustic_target": {"f1_range": [300, 500], "f2_range": [1800, 2300]},
        "common_errors": ["IY", "EH"],
        "category": "vowel"
    },
    "IY": {
        "ipa": "iː",
        "name": "ee sound (see)",
        "example_word": "see",
        "tip": "Smile wide! Teeth close together.",
        "tongue": "Tongue is high and toward the front, tense and stretched.",
        "mouth_shape": "mouth_smile_closed",
        "acoustic_target": {"f1_range": [200, 400], "f2_range": [2200, 2800]},
        "common_errors": ["IH"],
        "category": "vowel"
    },
    "UW": {
        "ipa": "uː",
        "name": "oo sound (moon)",
        "example_word": "moon",
        "tip": "Make a tiny tight circle with your lips.",
        "tongue": "Tongue is high and pulled toward the back.",
        "mouth_shape": "lips_small_circle",
        "acoustic_target": {"f1_range": [200, 400], "f2_range": [700, 1100]},
        "common_errors": ["UH", "OW"],
        "category": "vowel"
    },
    "AA": {
        "ipa": "ɑː",
        "name": "ah sound (father)",
        "example_word": "father",
        "tip": "Open your mouth wide and relax your jaw.",
        "tongue": "Tongue is low and pulled toward the back of your mouth.",
        "mouth_shape": "mouth_open_wide_relaxed",
        "acoustic_target": {"f1_range": [700, 1000], "f2_range": [1100, 1500]},
        "common_errors": ["AH", "AO"],
        "category": "vowel"
    },
    "AH": {
        "ipa": "ʌ",
        "name": "uh sound (cup)",
        "example_word": "cup",
        "tip": "Relax your mouth. Open just a little in the middle.",
        "tongue": "Tongue rests in the middle of your mouth, relaxed.",
        "mouth_shape": "mouth_open_relaxed_mid",
        "acoustic_target": {"f1_range": [600, 800], "f2_range": [1100, 1500]},
        "common_errors": ["AA", "ER"],
        "category": "vowel"
    },
    "AX": {
        "ipa": "ə",
        "name": "uh sound (ago)",
        "example_word": "ago",
        "tip": "Relax your whole mouth. Say a soft, quick uh.",
        "tongue": "Tongue rests in the middle of your mouth, very relaxed.",
        "mouth_shape": "mouth_relaxed_neutral",
        "acoustic_target": {"f1_range": [500, 700], "f2_range": [1200, 1600]},
        "common_errors": ["AH"],
        "category": "vowel"
    },
    "AW": {
        "ipa": "aʊ",
        "name": "ow sound (cow)",
        "example_word": "cow",
        "tip": "Start with your mouth open wide, then round your lips like blowing out a candle.",
        "tongue": "Tongue starts low, then rises toward the back as you finish.",
        "mouth_shape": "mouth_open_round_glide",
        "acoustic_target": {"f1_range": [600, 900], "f2_range": [1000, 1400]},
        "common_errors": ["AA", "OW"],
        "category": "vowel"
    },
    "AY": {
        "ipa": "aɪ",
        "name": "eye sound (my)",
        "example_word": "my",
        "tip": "Open your mouth, then smile as you finish the sound.",
        "tongue": "Tongue starts low, then rises toward the front as you finish.",
        "mouth_shape": "mouth_open_glide_smile",
        "acoustic_target": {"f1_range": [600, 900], "f2_range": [1400, 1900]},
        "common_errors": ["EY", "AA"],
        "category": "vowel"
    },
    "ER": {
        "ipa": "ɝ",
        "name": "er sound (bird)",
        "example_word": "bird",
        "tip": "Curl your tongue back a little. Keep your lips relaxed.",
        "tongue": "Tongue curls back toward the middle of your mouth.",
        "mouth_shape": "mouth_relaxed_curl",
        "acoustic_target": {"f1_range": [400, 600], "f2_range": [1300, 1700]},
        "common_errors": ["AH", "R"],
        "category": "vowel"
    },
    "EY": {
        "ipa": "eɪ",
        "name": "ay sound (day)",
        "example_word": "day",
        "tip": "Open your mouth halfway, then smile as you finish.",
        "tongue": "Tongue starts at middle height, then rises toward the front as you finish.",
        "mouth_shape": "mouth_half_open_glide_smile",
        "acoustic_target": {"f1_range": [400, 600], "f2_range": [1900, 2300]},
        "common_errors": ["EH", "IH"],
        "category": "vowel"
    },
    "OW": {
        "ipa": "oʊ",
        "name": "oh sound (go)",
        "example_word": "go",
        "tip": "Round your lips into an O shape.",
        "tongue": "Tongue starts in the middle back, then rises further back as you finish.",
        "mouth_shape": "lips_rounded_o",
        "acoustic_target": {"f1_range": [400, 600], "f2_range": [800, 1200]},
        "common_errors": ["AO", "UW"],
        "category": "vowel"
    },
    "OY": {
        "ipa": "ɔɪ",
        "name": "oy sound (boy)",
        "example_word": "boy",
        "tip": "Round your lips, then smile as you finish the sound.",
        "tongue": "Tongue starts low and back, then rises toward the front as you finish.",
        "mouth_shape": "lips_rounded_glide_smile",
        "acoustic_target": {"f1_range": [500, 800], "f2_range": [900, 1300]},
        "common_errors": ["AO", "OW"],
        "category": "vowel"
    },
    "UH": {
        "ipa": "ʊ",
        "name": "oo sound (book)",
        "example_word": "book",
        "tip": "Relax your lips into a small round shape.",
        "tongue": "Tongue is high and pulled toward the back, but relaxed.",
        "mouth_shape": "lips_relaxed_small_round",
        "acoustic_target": {"f1_range": [400, 600], "f2_range": [900, 1300]},
        "common_errors": ["UW", "AH"],
        "category": "vowel"
    },
    # ─── INDIAN-SPECIFIC ──────────────────────────────────────────
    "RT": {
        "ipa": "ʈ",
        "name": "retroflex t sound",
        "example_word": "taal",
        "tip": "Curl your tongue back and touch the roof of your mouth further back than usual.",
        "tongue": "Tongue curls back and touches further back on the roof of your mouth than a regular T.",
        "mouth_shape": "tongue_curled_back_touch",
        "acoustic_target": {"min_duration_ms": 100, "voiced": False},
        "common_errors": ["T"],
        "category": "stop"
    },
    "RD": {
        "ipa": "ɖ",
        "name": "retroflex d sound",
        "example_word": "daal",
        "tip": "Curl your tongue back and touch the roof of your mouth further back, then drop it with voice.",
        "tongue": "Tongue curls back and touches further back on the roof of your mouth than a regular D — with voice.",
        "mouth_shape": "tongue_curled_back_touch_voiced",
        "acoustic_target": {"min_duration_ms": 100, "voiced": True},
        "common_errors": ["D"],
        "category": "stop"
    },
}

ACOUSTIC_FEEDBACK_RULES = [
    {
        "id": "too_quiet",
        "condition": lambda a: a.get("loudness_db", 0) < -35,
        "tip": "Try speaking a little louder. Pretend you are talking to someone across the room.",
        "mood": "encourage"
    },
    {
        "id": "too_loud",
        "condition": lambda a: a.get("loudness_db", 0) > -10,
        "tip": "Great energy. Try speaking a little softer now.",
        "mood": "encourage"
    },
    {
        "id": "too_fast",
        "condition": lambda a: a.get("speaking_rate", 0) > 4.0,
        "tip": "Slow down a little. Take it one sound at a time.",
        "mood": "instruction"
    },
    {
        "id": "too_slow",
        "condition": lambda a: a.get("speaking_rate", 0) < 1.5 and a.get("speaking_rate", 0) > 0,
        "tip": "Good try. Now let the sounds flow together more smoothly.",
        "mood": "encourage"
    },
    {
        "id": "poor_voice_quality",
        "condition": lambda a: a.get("hnr_db", 25) < 10,
        "tip": "Take a breath and try again. Make sure your voice is nice and clear.",
        "mood": "encourage"
    },
    {
        "id": "high_jitter",
        "condition": lambda a: a.get("jitter_percent", 0) > 2.5,
        "tip": "Try to keep your voice steady and smooth, like a long smooth train track.",
        "mood": "instruction"
    },
]

DRILL_SEQUENCE_RULES = {
    "accuracy_threshold": 40,
    "max_attempts_before_drill": 3,
    "phonemes_per_session": 3,
}
