import { useState, useEffect } from 'react'

// Đường dẫn API Backend hoàn chỉnh
const API_URL = 'https://literate-lamp-r7rqjvq4jww7cg5-5000.app.github.dev/api/students'

function App() {
  const [students, setStudents] = useState([])
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' })

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setStudents(data)
    } catch (err) {
      console.error('Lỗi tải danh sách:', err)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setFormData({ studentId: '', name: '', email: '' })
        fetchStudents()
      } else {
        alert('Thêm thất bại!')
      }
    } catch (err) {
      console.error('Lỗi khi gửi form:', err)
      alert('Không thể gửi dữ liệu tới Backend!')
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <h2>Quản lý Sinh viên</h2>
      
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
        <button type="submit">Thêm sinh viên</button>
      </form>

      <h3>Danh sách Sinh viên</h3>
      <ul>
        {students.map(s => (
          <li key={s._id || s.studentId} style={{ marginBottom: '5px' }}>
            <strong>{s.studentId}</strong> - {s.name} ({s.email})
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App