import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, session } from '@/db/schema';
import { eq, gt } from 'drizzle-orm';

async function verifyAdmin(request: NextRequest): Promise<{ error?: string; status?: number; userId?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Authentication required', status: 401 };
    }

    const token = authHeader.substring(7);

    if (!token) {
      return { error: 'Invalid token format', status: 401 };
    }

    const sessionResult = await db
      .select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionResult.length === 0) {
      return { error: 'Invalid or expired session', status: 401 };
    }

    const userSession = sessionResult[0];
    const currentTime = new Date();

    if (userSession.expiresAt < currentTime) {
      return { error: 'Session expired', status: 401 };
    }

    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.id, userSession.userId))
      .limit(1);

    if (userResult.length === 0) {
      return { error: 'User not found', status: 401 };
    }

    const currentUser = userResult[0];

    if (currentUser.role !== 'admin') {
      return { error: 'Access denied. Admin privileges required', status: 403 };
    }

    return { userId: currentUser.id };
  } catch (error) {
    console.error('Admin verification error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error, code: 'AUTH_ERROR' },
        { status: adminCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      if (!id.trim()) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const userResult = await db
        .select()
        .from(user)
        .where(eq(user.id, id))
        .limit(1);

      if (userResult.length === 0) {
        return NextResponse.json(
          { error: 'User not found', code: 'USER_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(userResult[0], { status: 200 });
    }

    const allUsers = await db.select().from(user);

    return NextResponse.json(allUsers, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error, code: 'AUTH_ERROR' },
        { status: adminCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !id.trim()) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const userExists = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (body.role && body.role !== 'user' && body.role !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid role. Must be either "user" or "admin"', code: 'INVALID_ROLE' },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {
      ...body,
      updatedAt: new Date(),
    };

    delete updateData.id;
    delete updateData.createdAt;

    if (body.email !== undefined) {
      updateData.email = body.email.toLowerCase().trim();
    }

    if (body.name !== undefined) {
      updateData.name = body.name.trim();
    }

    const updatedUser = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update user', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedUser[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error, code: 'AUTH_ERROR' },
        { status: adminCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !id.trim()) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const userExists = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedUser = await db
      .delete(user)
      .where(eq(user.id, id))
      .returning();

    if (deletedUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete user', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'User deleted successfully',
        user: deletedUser[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}