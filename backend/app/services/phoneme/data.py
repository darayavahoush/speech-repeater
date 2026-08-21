# Complete phoneme library with mouth positions, tips, and example words

PHONEME_DATA = {
    # ─── CONSONANTS ───────────────────────────────────────────────
    "B": {
        "ipa": "b",
        "name": "b sound",
        "example_word": "ball",
        "tip": "Close your lips softly. Let your voice buzz. Pop them open.",
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
        "mouth_shape": "tongue_high_slide",
        "acoustic_target": {"min_duration_ms": 100, "voiced": True},
        "common_errors": ["JH", "L"],
        "category": "glide"
    },
    "H": {
        "ipa": "h",
        "name": "h sound",
        "example_word": "house",
        "tip": "Open your mouth gently. Breathe out. No buzzing.",
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
        "mouth_shape": "tongue_between_teeth",
        "acoustic_target": {"min_duration_ms": 150, "voiced": False},
        "common_errors": ["S", "F"],  # D substitution is standard Indian English variant, not flagged
        "category": "fricative"
    },
    # ─── VOWELS ───────────────────────────────────────────────────
    "AE": {
        "ipa": "æ",
        "name": "a sound (cat)",
        "example_word": "cat",
        "tip": "Open your mouth wide.",
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
        "mouth_shape": "lips_small_circle",
        "acoustic_target": {"f1_range": [200, 400], "f2_range": [700, 1100]},
        "common_errors": ["UH", "OW"],
        "category": "vowel"
    },
    # ─── INDIAN-SPECIFIC ──────────────────────────────────────────
    "RT": {
        "ipa": "ʈ",
        "name": "retroflex t sound",
        "example_word": "taal",
        "tip": "Curl your tongue back and touch the roof of your mouth further back than usual.",
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
