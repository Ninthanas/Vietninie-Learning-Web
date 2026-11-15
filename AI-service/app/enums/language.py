from enum import Enum


class Language(str, Enum):
    """Native (UI) language of the learner. The bot answers in this language."""

    VI = "vi"
    ZH = "zh"
