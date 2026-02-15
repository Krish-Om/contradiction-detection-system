from sqlmodel import SQLModel, Field


class Text(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    input_text: str


# TODO: Maybe we will be tokeninizing the texts
