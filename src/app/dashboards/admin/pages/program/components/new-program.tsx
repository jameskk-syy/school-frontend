"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Program, ProgramTable } from "./program-add-table"
import api from "@/lib/axios"
import toast, { Toaster } from "react-hot-toast"
import { Spinner } from "@/components/ui/spinner"

interface Department {
  name: string;
  department_name: string;
  company: string | null;
}

export function TabsDemo() {
  const [programs, setPrograms] = useState<Program[]>([])        // Add tab data
  const [program, setProgram] = useState<Program[]>([])          // View tab data
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [refresh, setRefresh] = useState(false)
  // Separate editing indices for Add and View tabs
  const [editingIndexAdd, setEditingIndexAdd] = useState<number | null>(null)
  const [editingIndexView, setEditingIndexView] = useState<number | null>(null)

  // Form data for Add tab
  const [formData, setFormData] = useState({
    program_name: "",
    program_abbreviation: "",
    department: "",
    hero_image: null as File | null,
  })

  // Form data for View tab
  const [formDatas, setFormDatas] = useState({
    program_name: "",
    program_abbreviation: "",
    department: "",
    hero_image: null as File | null,
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

  // Add/Update program in Add tab
  const addOrUpdatePrograms = (e: any) => {
    e.preventDefault()
    if (editingIndexAdd !== null) {
      const updated = [...programs]
      updated[editingIndexAdd] = { ...formData }
      setPrograms(updated)
      setEditingIndexAdd(null)
    } else {
      setPrograms([...programs, { ...formData }])
    }
    setFormData({ program_name: "", program_abbreviation: "", department: "", hero_image: null })
  }

  // Add/Update program in View tab
  const addOrUpdateProgram = (e: any) => {
    e.preventDefault()
    if (editingIndexView !== null) {
      const updated = [...program]
      updated[editingIndexView] = { ...formDatas }
      setProgram(updated)
      setEditingIndexView(null)
    } else {
      setProgram([...program, { ...formDatas }])
    }
    setFormDatas({ program_name: "", program_abbreviation: "", department: "", hero_image: null })
  }

  // Edit handlers
  const handleEdit = (index: number) => {
    setFormData(programs[index])
    setEditingIndexAdd(index)
  }

  const handleEdits = (index: number) => {
    setFormDatas(program[index])
    setEditingIndexView(index)
  }

  // Delete handlers
  const handleDelete = (index: number) => {
    setPrograms(programs.filter((_, i) => i !== index))
    if (editingIndexAdd === index) setEditingIndexAdd(null)
  }

  const handleDelets = (index: number) => {
    setProgram(program.filter((_, i) => i !== index))
    if (editingIndexView === index) setEditingIndexView(null)
  }

  //for saving programs added in Add tab
  const savePrograms = (e: any) => {
    e.preventDefault()
    if (programs.length === 0) {
      toast.error("No programs to save.")
      return
    }
    setIsLoading(true)
    api.post("school_app.services.rest.create_program", JSON.stringify(programs))
      .then((res) => {
        setIsLoading(false)
        setRefresh(prev => !prev)
        toast.success(res.data?.message?.message)
        setPrograms([])
      })
      .catch((err) => {
        setIsLoading(false)
        toast.error(err.response?.data?.message?.message)
      })
  }

  //for  updating programs in View tab
  const updatePrograms = (e: any) => {
    e.preventDefault()
    if (program.length === 0) {
      toast.error("No programs to update.")
      return
    }
    console.log("program", JSON.stringify(program))
    setIsLoading(true)
    api.post("school_app.services.rest.update_programs", JSON.stringify(program))
      .then((res) => {
        setRefresh(prev => !prev)
        setIsLoading(false)
        toast.success(res.data?.message?.message)
        // Optionally refresh the program list from server
      })
      .catch((err) => {
        setIsLoading(false)
        toast.error(err.response?.data?.message?.message)
      })
  }

  // Fetch programs from API for View tab
  useEffect(() => {
    setIsLoading(true)
    const fetchPrograms = async () => {
      api.get("school_app.services.rest.get_programs")
        .then((res) => {
          setIsLoading(false)
          const data: Program[] = res.data?.message?.data || []
          if (data.length > 0) setProgram(data)
        })
        .catch((err) => {
          setIsLoading(false)
          toast.error(err.response?.data?.message)
        })
    }
    fetchPrograms()
  }, [refresh])

  // Fetch departments
  useEffect(() => {
    setIsLoading(true)
    api.get("school_app.services.rest.get_departments")
      .then((res) => {
        setIsLoading(false)
        const data = res.data?.message?.data || []
        setDepartments(data)
      })
      .catch((err) => {
        setIsLoading(false)
        toast.error(err.response?.data?.message)
      })
  }, [])



  return (
    <div className="flex w-full flex-col gap-6">
      <Toaster />
      <Tabs defaultValue="add">
        <TabsList className="md:mb-2 lg:mb-2">
          <TabsTrigger value="add">Add New Program</TabsTrigger>
          <TabsTrigger value="view">View All Programs</TabsTrigger>
        </TabsList>

        {/* Add Tab */}
        <TabsContent value="add" className="w-full">
          <form onSubmit={addOrUpdatePrograms}>
            <Card>
              <CardHeader>
                <CardTitle>{editingIndexAdd !== null ? "Edit Program" : "Create New Program"}</CardTitle>
                <CardDescription>Enter data below and click {editingIndexAdd !== null ? "Update" : "Add"}.</CardDescription>
              </CardHeader>

              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="program_name">Program Name<span className="text-red-800"> *</span></Label>
                  <Input
                    name="program_name"
                    value={formData.program_name}
                    required
                    onChange={handleChange}
                    placeholder="Enter program name"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="program_abbreviation">Program Code <span className="text-red-800"> *</span></Label>
                  <Input
                    name="program_abbreviation"
                    required
                    value={formData.program_abbreviation}
                    onChange={handleChange}
                    placeholder="Enter program abbreviation"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    name="department"
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, department: val }))}
                    value={formData.department}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.length > 0 ? departments.map((dept) => (
                        <SelectItem key={dept.name} value={dept.name}>
                          {dept.department_name}
                        </SelectItem>
                      )) : (
                        <SelectItem value="none" disabled>No departments available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="hero_image">Program Image</Label>
                  <Input type="file" name="hero_image" onChange={handleChange} />
                  {formData.hero_image && <p className="text-sm">{formData.hero_image.name}</p>}
                </div>
              </CardContent>

              <CardFooter>
                {isLoading ? <Spinner /> : <Button type="submit">{editingIndexAdd !== null ? "Update Program" : "Add Program"}</Button>}
              </CardFooter>
            </Card>
          </form>
          <ProgramTable data={programs} onEdit={handleEdit} onDelete={handleDelete} purpose="add" />
          {isLoading ? <Spinner /> : <Button onClick={savePrograms} className="md:mt-4 sm:mt-2">Save Program/s</Button>}
        </TabsContent>

        {/* View Tab */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Here Are All Programs</CardTitle>
              <CardDescription>This is a list of programs</CardDescription>
            </CardHeader>

            <CardContent className="grid md:grid-cols-1 gap-6">
              <form onSubmit={addOrUpdateProgram}>
                <Card>
                  <CardHeader>
                    <CardTitle>{editingIndexView !== null ? "Edit Program" : "Add Program"}</CardTitle>
                    <CardDescription>Enter data below and click {editingIndexView !== null ? "Update" : "Add"}.</CardDescription>
                  </CardHeader>

                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="program_name">Program Name<span className="text-red-800"> *</span></Label>
                      <Input
                        name="program_name"
                        value={formDatas.program_name}
                        required
                        readOnly={editingIndexView == null}
                        onChange={handleChangeView}
                        placeholder="Enter program name"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="program_abbreviation">Program Code <span className="text-red-800"> *</span></Label>
                      <Input
                        name="program_abbreviation"
                        required
                        readOnly={editingIndexView == null}
                        value={formDatas.program_abbreviation}
                        onChange={handleChangeView}
                        placeholder="Enter program abbreviation"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        name="department"
                        disabled={editingIndexView == null}
                        onValueChange={(val) => setFormDatas((prev) => ({ ...prev, department: val }))}
                        value={formDatas.department}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.length > 0 ? departments.map((dept) => (
                            <SelectItem key={dept.name} value={dept.name}>
                              {dept.department_name}
                            </SelectItem>
                          )) : (
                            <SelectItem value="none" disabled>No departments available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="hero_image">Program Image</Label>
                      <Input type="file" name="hero_image" onChange={handleChangeView} disabled={editingIndexView == null} />
                      {formDatas.hero_image && <p className="text-sm">{formDatas.hero_image.name}</p>}
                    </div>
                  </CardContent>

                  <CardFooter>
                    {isLoading ? <Spinner /> : <Button type="submit" disabled={editingIndexView == null}>Update Program</Button>}
                  </CardFooter>
                </Card>
              </form>
              <ProgramTable data={program} onEdit={handleEdits} onDelete={handleDelets} purpose="view" />
            </CardContent>

            <CardFooter>
              {isLoading ? <Spinner /> : <Button  onClick = {updatePrograms} >Submit Program</Button>}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
