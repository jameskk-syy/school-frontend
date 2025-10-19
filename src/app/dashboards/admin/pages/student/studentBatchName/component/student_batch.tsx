"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/axios"
import toast, { Toaster } from "react-hot-toast"
import { Spinner } from "@/components/ui/spinner"
import { StudentBatchName, StudentBatchNameTable } from "./student_batch_table"
import { format } from "date-fns"

export function TabsStudentBatchName() {
  const [categoryDatas, setcategoryDatas] = useState<StudentBatchName[]>([])        // Add tab data
  const [categoyData, setcategoyData] = useState<StudentBatchName[]>([])          // View tab data
  const [isLoading, setIsLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  // Separate editing indices for Add and View tabs
  const [editingIndexAdd, setEditingIndexAdd] = useState<number | null>(null)
  const [editingIndexView, setEditingIndexView] = useState<number | null>(null)

  // Form data for Add tab
  const [formData, setFormData] = useState({
    name: "",
    batch_name: "",
    creation: "",
    modified: ""
  })

  // Form data for View tab
  const [formDatas, setFormDatas] = useState({
    name: "",
    batch_name: "",
    creation: "",
    modified: ""
  })

  // Handle Add tab inputs
  const handleChange = (e: any) => {
    const { name, value, files } = e.target
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle View tab inputs
  const handleChangeView = (e: any) => {
    const { name, value, files } = e.target
    if (files) {
      setFormDatas((prev) => ({ ...prev, [name]: files[0] }))
    } else {
      setFormDatas((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Add/Update categoyData in Add tab
  const addOrUpdatecategoryDatas = (e: any) => {
    e.preventDefault()
    if (editingIndexAdd !== null) {
      const updated = [...categoryDatas]
      updated[editingIndexAdd] = { ...formData }
      setcategoryDatas(updated)
      setEditingIndexAdd(null)
    } else {
      setcategoryDatas([...categoryDatas, { ...formData }])
    }
    setFormData({ batch_name: "", name: "", creation: "", modified: "" })
  }

  // Add/Update categoyData in View tab
  const addOrUpdatecategoyData = (e: any) => {
    e.preventDefault()
    if (editingIndexView !== null) {
      const updated = [...categoyData]
      updated[editingIndexView] = { ...formDatas }
      setcategoyData(updated)
      setEditingIndexView(null)
    } else {
      setcategoyData([...categoyData, { ...formDatas }])
    }
    setFormDatas({ batch_name: "", name: "", creation: "", modified: "" })
  }

  // Edit handlers
  const handleEdit = (index: number) => {
    setFormData(categoryDatas[index])
    setEditingIndexAdd(index)
  }

  const handleEdits = (index: number) => {
    setFormDatas(categoyData[index])
    setEditingIndexView(index)
  }

  // Delete handlers
  const handleDelete = (index: number) => {
    setcategoryDatas(categoryDatas.filter((_, i) => i !== index))
    if (editingIndexAdd === index) setEditingIndexAdd(null)
  }

  const handleDelets = (index: number) => {
    setcategoyData(categoyData.filter((_, i) => i !== index))
    if (editingIndexView === index) setEditingIndexView(null)
  }

  //for saving categoryDatas added in Add tab
  const savecategoryDatas = (e: any) => {
    e.preventDefault()
    if (categoryDatas.length === 0) {
      toast.error("No academic terms to save.")
      return
    }
    setIsLoading(true)
    api.post("school_app.services.rest.create_batch_name", JSON.stringify(categoryDatas))
      .then((res) => {
        setIsLoading(false)
        setRefresh(prev => !prev)
        toast.success(res.data?.message?.message)
        setcategoryDatas([])
      })
      .catch((err) => {
        setIsLoading(false)
        toast.error(err.response?.data?.message?.message)
      })
  }

  //for  updating categoryDatas in View tab
  const updatecategoryDatas = (e: any) => {
    e.preventDefault()
    if (categoyData.length === 0) {
      toast.error("No data to update.")
      return
    }
    console.log("categoyData", JSON.stringify(categoyData))
    setIsLoading(true)
    api.post("school_app.services.rest.update_categoy", JSON.stringify(categoyData))
      .then((res) => {
        setRefresh(prev => !prev)
        setIsLoading(false)
        toast.success(res.data?.message?.message)
      })
      .catch((err) => {
        setIsLoading(false)
        toast.error(err.response?.data?.message?.message)
      })
  }

  useEffect(() => {
    setIsLoading(true)
    api.get("school_app.services.rest.get_student_categories")
      .then((res) => {
        setIsLoading(false)
        const data = res.data?.message?.data || []
        setcategoyData(data)
      })
      .catch((err) => {
        setIsLoading(false)
        toast.error(err.response?.data?.message)
      })
  }, [refresh])



  return (
    <div className="flex w-full flex-col gap-6">
      <Toaster />
      <Tabs defaultValue="add">
        <TabsList className="md:mb-2 lg:mb-2">
          <TabsTrigger value="add">Add New Student Batch Name</TabsTrigger>
          <TabsTrigger value="view">View All Student Batch Name</TabsTrigger>
        </TabsList>

        {/* Add Tab */}
        <TabsContent value="add" className="w-full">
          <form onSubmit={addOrUpdatecategoryDatas}>
            <Card>
              <CardHeader>
                <CardTitle>{editingIndexAdd !== null ? "Edit Student Batch Name" : "Create Student Batch Name"}</CardTitle>
                <CardDescription>Enter data below and click {editingIndexAdd !== null ? "Update" : "Add"}.</CardDescription>
              </CardHeader>

              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="batch_name">Student Batch Name<span className="text-red-800"> *</span></Label>
                  <Input
                    name="batch_name"
                    value={formData.batch_name}
                    required
                    onChange={handleChange}
                    placeholder="Enter student Batch Name"
                  />
                </div>
              </CardContent>

              <CardFooter>
                {isLoading ? <Spinner /> : <Button type="submit">{editingIndexAdd !== null ? "Student Batch Name" : "Student Batch Name"}</Button>}
              </CardFooter>
            </Card>
          </form>
          <StudentBatchNameTable data={categoryDatas} onEdit={handleEdit} onDelete={handleDelete} purpose="add" />
          {isLoading ? <Spinner /> : <Button onClick={savecategoryDatas} className="md:mt-4 sm:mt-2">Save Batch</Button>}
        </TabsContent>

        {/* View Tab */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Here Are All Student Batch Name</CardTitle>
              <CardDescription>This is a list of Student Batch Name</CardDescription>
            </CardHeader>

            <CardContent className="grid md:grid-cols-1 gap-6">
              <form onSubmit={addOrUpdatecategoyData}>
                <Card>
                  <CardHeader>
                    <CardTitle>{editingIndexView !== null ? "Edit Student Batch Name" : "Add Student Category"}</CardTitle>
                    <CardDescription>Enter data below and click {editingIndexView !== null ? "Update" : "Add"}.</CardDescription>
                  </CardHeader>

                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="category">Student Batch Name Name<span className="text-red-800"> *</span></Label>
                      <Input
                        name="category"
                        value={formDatas.batch_name}
                        required
                        onChange={handleChangeView}
                        placeholder="Enter student Batch Name name"
                      />
                    </div>
                  </CardContent>

                  <CardFooter>
                    {isLoading ? <Spinner /> : <Button type="submit" disabled={editingIndexView == null}>Update Student Batch Name</Button>}
                  </CardFooter>
                </Card>
              </form>
              <StudentBatchNameTable data={categoyData} onEdit={handleEdits} onDelete={handleDelets} purpose="view" />
            </CardContent>

            <CardFooter>
              {isLoading ? <Spinner /> : <Button onClick={updatecategoryDatas} >Submit Student Batch Name</Button>}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
