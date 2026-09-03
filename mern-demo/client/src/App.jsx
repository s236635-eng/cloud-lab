import { useState, useEffect } from 'react'

const API_URL = 'https://literate-lamp-r7rqjvq4jww7cg5-5000.app.github.dev/api/students'

function App() {
  const [students, setStudents] = useState([])
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' })
  const [editingId, setEditingId] = useState(null)

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setStudents(data)
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Thêm mới hoặc Cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `${API_URL}/${editingId}` : API_URL

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setFormData({ studentId: '', name: '', email: '' })
        setEditingId(null)
        fetchStudents()
      }
    } catch (err) {
      console.error('Lỗi lưu dữ liệu:', err)
    }
  }

  // Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id)
    setFormData({ studentId: student.studentId, name: student.name, email: student.email })
  }

  // Xóa sinh viên
  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sinh viên này?')) return
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (res.ok) fetchStudents()
    } catch (err) {
      console.error('Lỗi xóa sinh viên:', err)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '700px' }}>
      <h2>Quản lý Sinh viên (MERN Stack)</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          placeholder="MSSV" 
          value={formData.studentId} 
          onChange={e => setFormData({...formData, studentId: e.target.value})} 
          required 
        />
        <input 
          placeholder="Họ tên" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <input 
          placeholder="Email" 
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          required 
        />
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm sinh viên'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ studentId: '', name: '', email: '' }) }}>Hủy</button>}
      </form>

      <h3>Danh sách Sinh viên</h3>
      <ul>
        {students.map(s => (
          <li key={s._id} style={{ marginBottom: '10px' }}>
            <strong>{s.studentId}</strong> - {s.name} ({s.email}){' '}
            <button onClick={() => handleEdit(s)}>Sửa</button>{' '}
            <button onClick={() => handleDelete(s._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App