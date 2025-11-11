import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dunar-secret-key');

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

/**
 * Verifica o token JWT e retorna os dados do usuário autenticado
 * @param request - Requisição Next.js
 * @returns Dados do usuário autenticado ou null se não autenticado
 */
export async function verifyAuth(request?: NextRequest): Promise<AuthPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, secret);
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      isAdmin: payload.isAdmin as boolean,
      isSuperAdmin: payload.isSuperAdmin as boolean,
    };
  } catch (error) {
    console.error('Erro ao verificar token JWT:', error);
    return null;
  }
}

/**
 * Verifica se o usuário autenticado é um administrador
 * @param request - Requisição Next.js
 * @returns true se for admin, false caso contrário
 */
export async function isAdmin(request?: NextRequest): Promise<boolean> {
  const auth = await verifyAuth(request);
  return auth?.isAdmin === true;
}

/**
 * Verifica se o usuário autenticado é um superadministrador
 * @param request - Requisição Next.js
 * @returns true se for superadmin, false caso contrário
 */
export async function isSuperAdmin(request?: NextRequest): Promise<boolean> {
  const auth = await verifyAuth(request);
  return auth?.isSuperAdmin === true;
}

/**
 * Verifica se o usuário tem permissão para executar uma ação
 * @param request - Requisição Next.js
 * @param requiredRole - Role mínimo necessário (FUNCIONARIO, ADMIN, SUPERADMIN)
 * @returns true se tiver permissão, false caso contrário
 */
export async function hasPermission(
  request?: NextRequest,
  requiredRole: 'FUNCIONARIO' | 'ADMIN' | 'SUPERADMIN' = 'FUNCIONARIO'
): Promise<boolean> {
  const auth = await verifyAuth(request);
  
  if (!auth || !auth.isAdmin) {
    return false;
  }
  
  // Hierarquia de permissões
  const roleHierarchy: Record<string, number> = {
    'FUNCIONARIO': 1,
    'ADMIN': 2,
    'SUPERADMIN': 3
  };
  
  const userLevel = roleHierarchy[auth.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
}

/**
 * Cria um log de auditoria para ações críticas
 * @param action - Ação executada
 * @param details - Detalhes da ação
 * @param userId - ID do usuário que executou a ação
 */
export async function auditLog(
  action: string,
  details: Record<string, any>,
  userId: string
): Promise<void> {
  try {
    console.log('[AUDIT]', {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details
    });
    // TODO: Salvar no banco de dados em uma tabela de auditoria
  } catch (error) {
    console.error('Erro ao criar log de auditoria:', error);
  }
}
