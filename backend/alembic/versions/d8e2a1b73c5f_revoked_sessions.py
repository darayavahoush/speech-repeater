"""revoked sessions

Revision ID: d8e2a1b73c5f
Revises: c4a7f9e21d3b
Create Date: 2026-10-03 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd8e2a1b73c5f'
down_revision: Union[str, Sequence[str], None] = 'c4a7f9e21d3b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'revoked_sessions',
        sa.Column('token_hash', sa.String(), primary_key=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('revoked_sessions')
