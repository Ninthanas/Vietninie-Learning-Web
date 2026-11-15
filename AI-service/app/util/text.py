import re

_BOLD = re.compile(r"(\*\*|__)(.+?)\1", re.S)
_HEADING = re.compile(r"^\s{0,3}#{1,6}\s*", re.M)
_BULLET = re.compile(r"^(\s*)\*\s+", re.M)


def strip_markdown(text: str) -> str:
    """Safety net: the UI shows plain text, so remove markdown markers the model may still emit."""
    text = _BOLD.sub(r"\2", text)
    text = _HEADING.sub("", text)
    text = _BULLET.sub(r"\1- ", text)
    text = text.replace("**", "").replace("`", "")
    return text.strip()
