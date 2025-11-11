"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableHead, TableHeadChild, TableBody, TableBodyChild, TableBodyRow } from "@/components/ui/table"
import Image from "next/image"
import Page from "@/components/ui/page"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"
import Logo from "@/components/ui/logo"
import Form from "@/components/ui/form"
import Card from "@/components/ui/card"
import Modal from "@/components/ui/modal"
import Menu from "../components/menu"
import IconedButton from "@/components/ui/iconed-button"
import RegisterIcon from "public/icons/register-icon.svg"
import LogoutIcon from "public/icons/logout-icon.svg"
import NavigationButtons from "@/components/ui/navigation-buttons"

type Admin = {
  id: string
  username: string
  email: string
  phone?: string | null
  role: string
  isSuperAdmin: boolean
  twoFactorEnabled?: boolean
  twoFactorMethod?: string | null
}

export default function Cadastro() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false)
  const [registeredUsers, setRegisteredUsers] = useState<Admin[]>([])
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  
  // Form state para novo cadastro
  const [formUsername, setFormUsername] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formPassword, setFormPassword] = useState("")
  const [formRole, setFormRole] = useState("FUNCIONARIO")
  
  // Form state para edição
  const [editUsername, setEditUsername] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [editTwoFactorEnabled, setEditTwoFactorEnabled] = useState(false)
  const [editTwoFactorMethod, setEditTwoFactorMethod] = useState("")
  
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admins")
      const data = await response.json()
      // Garantir que data seja um array
      setRegisteredUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao buscar administradores:", error)
      setRegisteredUsers([])
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleRegister = async () => {
    if (!formUsername || !formEmail || !formPassword) {
      alert("Por favor, preencha usuário, email e senha")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formUsername,
          email: formEmail,
          phone: formPhone || null,
          password: formPassword,
          role: formRole,
        }),
      })

      if (response.ok) {
        setFormUsername("")
        setFormEmail("")
        setFormPhone("")
        setFormPassword("")
        setIsRegisterModalOpen(false)
        fetchAdmins()
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao cadastrar administrador")
      }
    } catch (error) {
      console.error("Erro ao cadastrar administrador:", error)
      alert("Erro ao cadastrar administrador")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin)
    setEditUsername(admin.username)
    setEditEmail(admin.email)
    setEditPhone(admin.phone || "")
    setEditPassword("")
    setEditTwoFactorEnabled(admin.twoFactorEnabled || false)
    setEditTwoFactorMethod(admin.twoFactorMethod || "")
    setIsEditModalOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedAdmin) return
    if (!editUsername || !editEmail) {
      alert("Usuário e email são obrigatórios")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admins/${selectedAdmin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
          phone: editPhone || null,
          password: editPassword || undefined,
          twoFactorEnabled: editTwoFactorEnabled,
          twoFactorMethod: editTwoFactorMethod || null,
        }),
      })

      if (response.ok) {
        setIsEditModalOpen(false)
        setSelectedAdmin(null)
        fetchAdmins()
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao atualizar administrador")
      }
    } catch (error) {
      console.error("Erro ao atualizar administrador:", error)
      alert("Erro ao atualizar administrador")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedAdmin) return

    try {
      const response = await fetch(`/api/admins/${selectedAdmin.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setIsDeleteModalOpen(false)
        setSelectedAdmin(null)
        fetchAdmins()
      } else {
        const error = await response.json()
        alert(error.error || "Erro ao deletar administrador")
      }
    } catch (error) {
      console.error("Erro ao deletar administrador:", error)
      alert("Erro ao deletar administrador")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      router.push("/admin")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      router.push("/admin")
    }
  }

  return (
    <>
      <Page className="flex flex-col gap-5">
        <NavigationButtons position="top-left" />

        <button className="absolute top-0 right-0 m-3 hover:cursor-pointer" onClick={() => setLogoutModalOpen(true)}>
          <Image src={LogoutIcon} alt="Logout" width={30} />
        </button>

        <Form className="w-full">
          <Logo href="/admin/pagamentos" title="Cadastro de Administradores" />
          <Menu />
        </Form>

        <Card>
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-semibold">Usuários Cadastrados</h2>

            <IconedButton
              text="Novo Cadastro"
              icon={RegisterIcon}
              onClick={() => setIsRegisterModalOpen(true)}
              className="!w-full sm:!w-45"
            />
          </div>

          <Table>
            <TableHead>
              <TableHeadChild border={false}>Usuário</TableHeadChild>
              <TableHeadChild>Email</TableHeadChild>
              <TableHeadChild>Telefone</TableHeadChild>
              <TableHeadChild>Tipo</TableHeadChild>
              <TableHeadChild>2FA</TableHeadChild>
              <TableHeadChild>Ações</TableHeadChild>
            </TableHead>

            <TableBody>
              {registeredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 opacity-60">
                    Nenhum administrador encontrado.
                  </td>
                </tr>
              ) : (
                registeredUsers.map((user) => (
                  <TableBodyRow key={user.id}>
                    <TableBodyChild border={false}>
                      <button 
                        onClick={() => handleEdit(user)}
                        className="cursor-pointer hover:text-primary transition-colors text-left w-full"
                      >
                        {user.username}
                      </button>
                    </TableBodyChild>
                    <TableBodyChild>{user.email}</TableBodyChild>
                    <TableBodyChild>{user.phone || "-"}</TableBodyChild>
                    <TableBodyChild>
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.isSuperAdmin ? 'bg-purple-500/20 text-purple-300' :
                        user.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {user.isSuperAdmin ? 'Super Admin' : user.role === 'ADMIN' ? 'Admin' : 'Funcionário'}
                      </span>
                    </TableBodyChild>
                    <TableBodyChild>
                      {user.twoFactorEnabled ? `✓ ${user.twoFactorMethod}` : "-"}
                    </TableBodyChild>

                    <TableBodyChild>
                      {user.isSuperAdmin ? (
                        <span className="text-xs sm:text-sm text-primary font-semibold bg-primary/10 px-3 py-2 rounded border border-primary/30">
                          Protegido
                        </span>
                      ) : (
                        <Button
                          text="Excluir"
                          onClick={() => {
                            setSelectedAdmin(user)
                            setIsDeleteModalOpen(true)
                          }}
                          className="w-full !bg-cancel"
                        />
                      )}
                    </TableBodyChild>
                  </TableBodyRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </Page>

      {/* Modal de Exclusão */}
      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <Card>
          <span className="text-[1.2rem] text-center text-gray-50">Confirmar exclusão?</span>

          <div className="w-full">
            <Button
              type="button"
              text="Sim"
              className="w-full mt-2"
              onClick={handleDelete}
            />
            <Button
              type="button"
              text="Não"
              className="w-full mt-2"
              onClick={() => setIsDeleteModalOpen(false)}
            />
          </div>
        </Card>
      </Modal>

      {/* Modal de Novo Cadastro */}
      <Modal open={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}>
        <Form>
          <span className="text-[1.2rem] text-center text-gray-50">Novo Cadastro</span>

          <div className="w-full flex flex-col gap-2 mt-2">
            <Input 
              type="text" 
              placeholder="Usuário" 
              className="min-w-full" 
              value={formUsername}
              onChange={(e) => setFormUsername(e.target.value)}
              required 
            />
            <Input 
              type="email" 
              placeholder="Email" 
              className="min-w-full" 
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required 
            />
            <Input 
              type="tel" 
              placeholder="Telefone (opcional)" 
              className="min-w-full" 
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Senha" 
              className="min-w-full" 
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              required 
            />

            <div className="w-full">
              <label className="text-sm text-gray-300 mb-1 block">Tipo de Usuário</label>
              <select
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-primary"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
              >
                <option value="FUNCIONARIO">Funcionário</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div>
              <Button
                type="button"
                text={loading ? "Cadastrando..." : "Cadastrar"}
                className="w-full"
                onClick={handleRegister}
                disabled={loading}
              />

              <Button
                type="button"
                text="Fechar"
                className="w-full mt-2"
                onClick={() => setIsRegisterModalOpen(false)}
              />
            </div>
          </div>
        </Form>
      </Modal>

      {/* Modal de Edição */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Form>
          <span className="text-[1.2rem] text-center text-gray-50">Editar Administrador</span>

          <div className="w-full flex flex-col gap-2 mt-2">
            <Input 
              type="text" 
              placeholder="Usuário" 
              className="min-w-full" 
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              required 
            />
            <Input 
              type="email" 
              placeholder="Email" 
              className="min-w-full" 
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              required 
            />
            <Input 
              type="tel" 
              placeholder="Telefone" 
              className="min-w-full" 
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Nova Senha (deixe vazio para não alterar)" 
              className="min-w-full" 
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />

            {/* Configurações de 2FA */}
            <div className="bg-background-muted p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="edit2FA"
                  checked={editTwoFactorEnabled}
                  onChange={(e) => setEditTwoFactorEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-background-muted text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                />
                <label htmlFor="edit2FA" className="text-white cursor-pointer select-none text-sm">
                  Ativar Autenticação de Dois Fatores (2FA)
                </label>
              </div>

              {editTwoFactorEnabled && (
                <select
                  value={editTwoFactorMethod}
                  onChange={(e) => setEditTwoFactorMethod(e.target.value)}
                  className="w-full p-2 rounded bg-background text-white border border-gray-600"
                >
                  <option value="">Selecione o método</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS (requer telefone)</option>
                </select>
              )}
            </div>

            <div>
              <Button
                type="button"
                text={loading ? "Salvando..." : "Salvar Alterações"}
                className="w-full"
                onClick={handleUpdate}
                disabled={loading}
              />

              <Button
                type="button"
                text="Fechar"
                className="w-full mt-2"
                onClick={() => setIsEditModalOpen(false)}
              />
            </div>
          </div>
        </Form>
      </Modal>

      {/* Modal de Logout */}
      <Modal open={isLogoutModalOpen} onClose={() => setLogoutModalOpen(false)}>
        <Card>
          <span className="text-[1.2rem] text-center text-gray-50">Deseja sair?</span>
          <div className="w-full">
            <Button
              text="Sim"
              className="w-full mt-2"
              onClick={handleLogout}
            />
            <Button text="Não" className="w-full mt-2" onClick={() => setLogoutModalOpen(false)} />
          </div>
        </Card>
      </Modal>
    </>
  )
}
