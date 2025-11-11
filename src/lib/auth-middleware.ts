import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { AdminRole, hasPermission, Permission } from './permissions'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthenticatedAdmin {
  id: string
  username: string
  email: string
  role: AdminRole
  isSuperAdmin: boolean
}

// Verificar token JWT e retornar dados do admin
export async function verifyAdminToken(
  token: string
): Promise<AuthenticatedAdmin | null> {
  try {
    const decoded = verify(token, JWT_SECRET) as any
    
    // Buscar admin no banco para garantir dados atualizados
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isSuperAdmin: true,
      },
    })

    if (!admin) return null

    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role as AdminRole,
      isSuperAdmin: admin.isSuperAdmin,
    }
  } catch (error) {
    return null
  }
}

// Middleware para verificar autenticação
export async function requireAuth(
  request: NextRequest
): Promise<AuthenticatedAdmin | NextResponse> {
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 }
    )
  }

  const admin = await verifyAdminToken(token)

  if (!admin) {
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    )
  }

  return admin
}

// Middleware para verificar permissão específica
export async function requirePermission(
  request: NextRequest,
  permission: keyof Permission
): Promise<AuthenticatedAdmin | NextResponse> {
  const authResult = await requireAuth(request)

  // Se já retornou erro de autenticação
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const admin = authResult as AuthenticatedAdmin

  // Verificar se tem a permissão
  if (!hasPermission(admin.role, permission)) {
    return NextResponse.json(
      { error: 'Sem permissão para esta ação' },
      { status: 403 }
    )
  }

  return admin
}

// Middleware para verificar se é superadmin
export async function requireSuperAdmin(
  request: NextRequest
): Promise<AuthenticatedAdmin | NextResponse> {
  const authResult = await requireAuth(request)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const admin = authResult as AuthenticatedAdmin

  if (!admin.isSuperAdmin) {
    return NextResponse.json(
      { error: 'Apenas super administrador pode realizar esta ação' },
      { status: 403 }
    )
  }

  return admin
}

// Verificar se pode deletar um admin
export async function canDeleteAdmin(
  currentAdmin: AuthenticatedAdmin,
  targetAdminId: string
): Promise<{ allowed: boolean; reason?: string }> {
  // Buscar admin alvo
  const targetAdmin = await prisma.admin.findUnique({
    where: { id: targetAdminId },
    select: { isSuperAdmin: true, role: true },
  })

  if (!targetAdmin) {
    return { allowed: false, reason: 'Usuário não encontrado' }
  }

  // Superadmin não pode ser deletado
  if (targetAdmin.isSuperAdmin) {
    return { allowed: false, reason: 'Super administrador não pode ser excluído' }
  }

  // Apenas superadmin pode deletar qualquer um
  if (currentAdmin.isSuperAdmin) {
    return { allowed: true }
  }

  // Admin pode deletar apenas funcionários
  if (currentAdmin.role === 'ADMIN' && targetAdmin.role === 'FUNCIONARIO') {
    return { allowed: true }
  }

  return { allowed: false, reason: 'Sem permissão para excluir este usuário' }
}
