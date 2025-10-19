"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/lib/axios"
import toast, { Toaster } from "react-hot-toast"
import { Spinner } from "@/components/ui/spinner"
import { AcademicYear, AcademicYearTable } from "./new-academic-year-table"
import { format } from "date-fns"
import { Calendar22 } from "./calendar"

interface Department {
  name: string
  department_name: string
  company: string | null
}

export function TabsAcademicYears() {
  const [academicYears, setacademicYears] = React.useState<AcademicYear[]>([])
  const [academicYear, setacademicYear] = React.useState<AcademicYear[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [refresh, setRefresh] = React.useState(false)
  const [editingIndexAdd, setEditingIndexAdd] = React.useState<number | null>(null)
  const [editingIndexView, setEditingIndexView] = React.useState<number | null>(null)

  const [formData, setFormData] = React.useState({
    academic_year_name: "",
    year_start_date: "",
    year_end_date: "",
  })

  const [formDatas, setFormDatas] = React.useState({
    academic_year_name: "",
    year_start_date: "",
    year_end_date: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }


  const handleChangeView = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormDatas(prev => ({ ...prev, [name]: value }))
  }

  const addOrUpdateacademicYears = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingIndexAdd !== null) {
      const updated = [...academicYears]
      updated[editingIndexAdd] = { ...formData }
      setacademicYears(updated)
      setEditingIndexAdd(null)
    } else {
      setacademicYears([...academicYears, { ...formData }])
    }
    setFormData({ academic_year_name: "", year_start_date: "", year_end_date: "" })
  }

const addOrUpdateacademicYear = (e: React.FormEvent) => {
  e.preventDefault()
  setacademicYear(prev => {
    const updated = [...prev]
    if (editingIndexView !== null) {
      updated[editingIndexView] = { ...formDatas }
    } else {
      updated.push({ ...formDatas })
    }
    return updated
  })
  setEditingIndexView(null)
  setFormDatas({ academic_year_name: "", year_start_date: "", year_end_date: "" })
}

  const handleEdit = (index: number) => {
    setFormData(academicYears[index])
    setEditingIndexAdd(index)
  }

  const handleEdits = (index: number) => {
    setFormDatas(academicYear[index])
    setEditingIndexView(index)
  }

  const handleDelete = (index: number) => {
    setacademicYears(academicYears.filter((_, i) => i !== index))
    if (editingIndexAdd === index) setEditingIndexAdd(null)
  }

  const handleDelets = (index: number) => {
    setacademicYear(academicYear.filter((_, i) => i !== index))
    if (editingIndexView === index) setEditingIndexView(null)
  }

  const saveAcademicYEars= (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (academicYears.length === 0) {
      toast.error("No academicYears to save.")
      return
    }
    setIsLoading(true)
    api.post("school_app.services.rest.create_academic_year", JSON.stringify(academicYears))
      .then(res => {
        setIsLoading(false)
        setRefresh(prev => !prev)
        toast.success(res.data?.message?.message)
        setacademicYears([])
      })
      .catch(err => {
        setIsLoading(false)
        toast.error(err.response?.data?.message?.message)
      })
  }

  const updateacademicYears = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (academicYear.length === 0) {
      toast.error("No academicYears to update.")
      return
    }
    console.log(academicYear)
    setIsLoading(true)
    api.post("school_app.services.rest.update_academic_year", JSON.stringify(academicYear))
      .then(res => {
        setRefresh(prev => !prev)
        setIsLoading(false)
        toast.success(res.data?.message?.message)
      })
      .catch(err => {
        setIsLoading(false)
        toast.error(err.response?.data?.message?.message)
      })
  }

    React.useEffect(() => {
      setIsLoading(true)
      const fetchPrograms = async () => {
        api.get("school_app.services.rest.get_academic_years")
          .then((res) => {
            setIsLoading(false)
            const data: AcademicYear[] = res.data?.message?.data || []
            if (data.length > 0) setacademicYear(data)
          })
          .catch((err) => {
            setIsLoading(false)
            toast.error(err.response?.data?.message)
          })
      }
      fetchPrograms()
    }, [refresh])
  

  return (
    <div className="flex w-full flex-col gap-6">
      <Toaster />
      <Tabs defaultValue="add">
        <TabsList className="md:mb-2 lg:mb-2">
          <TabsTrigger value="add">Add New Academic Year</TabsTrigger>
          <TabsTrigger value="view">View All Academic Year</TabsTrigger>
        </TabsList>

        {/* Add Tab */}
        <TabsContent value="add" className="w-full">
          <form onSubmit={addOrUpdateacademicYears}>
            <Card>
              <CardHeader>
                <CardTitle>{editingIndexAdd !== null ? "Edit academicYear" : "Create New Academic Year"}</CardTitle>
                <CardDescription>Enter data below and click {editingIndexAdd !== null ? "Update" : "Add"}.</CardDescription>
              </CardHeader>

              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="academic_year_name">Academic Year Name<span className="text-red-800"> *</span></Label>
                  <Input
                    name="academic_year_name"
                    value={formData.academic_year_name}
                    required
                    onChange={handleChange}
                    placeholder="Enter academic year name"
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Academic Year Start Date<span className="text-red-800"> *</span></Label>
                  <Calendar22
                    date={formData.year_start_date ? new Date(formData.year_start_date) : undefined}
                    onSelect={(date: Date) => setFormData(prev => ({
                      ...prev,
                      year_start_date: format(date, "yyyy-MM-dd")
                    }))}
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Academic Year End Date</Label>
                  <Calendar22
                    date={formData.year_end_date ? new Date(formData.year_end_date) : undefined}
                    onSelect={(date: Date) => setFormData(prev => ({
                      ...prev,
                      year_end_date: format(date, "yyyy-MM-dd")
                    }))}
                  />
                </div>
              </CardContent>

              <CardFooter>
                {isLoading ? <Spinner /> : <Button type="submit">{editingIndexAdd !== null ? "Update Academic Year" : "Add Academic Year"}</Button>}
              </CardFooter>
            </Card>
          </form>

          <AcademicYearTable
            data={academicYears}
            onEdit={handleEdit}
            onDelete={handleDelete}
            purpose="add"
          />
          {academicYears.length > 0 && <Button onClick={saveAcademicYEars} className="md:mt-4 sm:mt-2">Save Academic Year/s</Button>}
        </TabsContent>

        {/* View Tab */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Here Are All Academic Year</CardTitle>
              <CardDescription>This is a list of academic year</CardDescription>
            </CardHeader>

            <CardContent className="grid md:grid-cols-1 gap-6">
              <form onSubmit={addOrUpdateacademicYear}>
                <Card>
                  <CardHeader>
                    <CardTitle>{editingIndexView !== null ? "Edit Academic Year" : "Add Academic Year"}</CardTitle>
                    <CardDescription>Enter data below and click {editingIndexView !== null ? "Update" : "Add"}.</CardDescription>
                  </CardHeader>

                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="academic_year_name">Academic Year Name<span className="text-red-800"> *</span></Label>
                      <Input
                        name="academic_year_name"
                        value={formDatas.academic_year_name}
                        required
                        onChange={handleChangeView}
                        placeholder="Enter academic year name"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label>Academic Year Start Date<span className="text-red-800"> *</span></Label>
                      <Calendar22
                        date={formDatas.year_start_date ? new Date(formDatas.year_start_date) : undefined}
                        onSelect={(date: Date) => setFormDatas(prev => ({
                          ...prev,
                          year_start_date: format(date, "yyyy-MM-dd")
                        }))}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label>Academic Year End Date</Label>
                      <Calendar22
                        date={formDatas.year_end_date ? new Date(formDatas.year_end_date) : undefined}
                        onSelect={(date: Date) => setFormDatas(prev => ({
                          ...prev,
                          year_end_date: format(date, "yyyy-MM-dd")
                        }))}
                      />
                    </div>
                  </CardContent>

                  <CardFooter>
                    {isLoading ? <Spinner /> : <Button type="submit" disabled={editingIndexView == null}>Update Academic Year</Button>}
                  </CardFooter>
                </Card>
              </form>

              <AcademicYearTable
                data={academicYear}
                onEdit={handleEdits}
                onDelete={handleDelets}
                purpose="view"
              />
            </CardContent>

            <CardFooter>
              {isLoading ? <Spinner /> : <Button onClick={updateacademicYears}>Submit Academic Year</Button>}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
