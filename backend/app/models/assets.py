from sqlalchemy import Enum, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, JSONBType, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import AssetManifestType


class AssetManifest(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "asset_manifest_entries"
    __table_args__ = (
        Index("ix_asset_manifest_entries_key", "asset_key", unique=True),
        Index("ix_asset_manifest_entries_type", "manifest_type"),
    )

    manifest_type: Mapped[AssetManifestType] = mapped_column(
        Enum(AssetManifestType, native_enum=False), nullable=False
    )
    asset_key: Mapped[str] = mapped_column(String(160), nullable=False)
    path: Mapped[str] = mapped_column(String(500), nullable=False)
    extra: Mapped[dict] = mapped_column(JSONBType, default=dict, nullable=False)
