// Sistema de Permissões por Role

export type AdminRole = 'SUPERADMIN' | 'ADMIN' | 'FUNCIONARIO'

export interface Permission {
  viewReports: boolean
  managePayments: boolean
  createClients: boolean
  viewClients: boolean
  createAdmins: boolean
  deleteAdmins: boolean
  manageAllUsers: boolean
}

// Definição de permissões por role
export const ROLE_PERMISSIONS: Record<AdminRole, Permission> = {
  SUPERADMIN: {
    viewReports: true,
    managePayments: true,
    createClients: true,
    viewClients: true,
    createAdmins: true,
    deleteAdmins: true,
    manageAllUsers: true,
  },
  ADMIN: {
    viewReports: true,
    managePayments: true,
    createClients: true,
    viewClients: true,
    createAdmins: true, // Admin pode criar funcionários
    deleteAdmins: false, // Mas não pode deletar outros admins
    manageAllUsers: true,
  },
  FUNCIONARIO: {
    viewReports: true,
    managePayments: true,
    createClients: true,
    viewClients: true,
    createAdmins: false,
    deleteAdmins: false,
    manageAllUsers: false,
  },
}

// Função para verificar se um usuário tem uma permissão específica
export function hasPermission(
  role: AdminRole,
  permission: keyof Permission
): boolean {
  return ROLE_PERMISSIONS[role][permission]
}

// Função para obter todas as permissões de um role
export function getPermissions(role: AdminRole): Permission {
  return ROLE_PERMISSIONS[role]
}

// Labels para exibição
export const ROLE_LABELS: Record<AdminRole, string> = {
  SUPERADMIN: 'Super Administrador',
  ADMIN: 'Administrador',
  FUNCIONARIO: 'Funcionário',
}

// Descrições das permissões
export const PERMISSION_DESCRIPTIONS: Record<keyof Permission, string> = {
  viewReports: 'Visualizar relatórios',
  managePayments: 'Gerenciar pagamentos',
  createClients: 'Cadastrar novos clientes',
  viewClients: 'Visualizar cadastros existentes',
  createAdmins: 'Criar administradores e funcionários',
  deleteAdmins: 'Excluir administradores',
  manageAllUsers: 'Gerenciar todos os usuários',
}
