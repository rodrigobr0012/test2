from __future__ import annotations

from bson import ObjectId
from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import GetJsonSchemaHandler
from pydantic_core import core_schema


class PyObjectId(ObjectId):
    """Custom type to integrate MongoDB ObjectId with Pydantic v2."""

    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):  # type: ignore[override]
        return core_schema.no_info_after_validator_function(cls.validate, core_schema.str_schema())

    @classmethod
    def __get_pydantic_json_schema__(cls, schema, handler: GetJsonSchemaHandler):  # type: ignore[override]
        json_schema = handler(schema)
        json_schema.update(type="string", example="64f1c2c3a7b1f3a4eb4a8d2f")
        return json_schema

    @classmethod
    def validate(cls, value: object) -> ObjectId:
        if isinstance(value, ObjectId):
            return value
        if isinstance(value, cls):
            return ObjectId(value)
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)


def object_id_to_str(data: dict | None) -> dict | None:
    """Convert _id fields to plain string id for responses."""
    if not data:
        return data
    data = dict(data)
    object_id = data.pop("_id", None)
    if object_id is not None:
        data["id"] = str(object_id)
    return data


class MongoBaseModel(BaseModel):
    """Base model with sensible defaults for MongoDB documents."""

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)
