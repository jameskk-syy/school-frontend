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
import { AcademicTerm, AcademicTermTable } from "./new-academic-term-table"
import { Calendar22 } from "../../academicYear/component/calendar"
import { format } from "date-fns"

interface AcademicYear {
  name: string;
  academic_year_name: string;
  year_start_date: string | null;
  year_end_date: string;

}

export function TabsAcademicTerm() {
  const [academicTerms, setacademicTerms] = useState<AcademicTerm[]>([])        // Add tab data
  const [academicTerm, setacademicTerm] = useState<AcademicTerm[]>([])          // View tab data
  const [isLoading, setIsLoading] = useState(false)
  const [academicYear, setAcademicYear] = useState<AcademicYear[]>([])
  const [refresh, setRefresh] = useState(false)
  // Separate editing indices for Add and View tabs
  const [editingIndexAdd, setEditingIndexAdd] = useState<number | null>(null)
  const [editingIndexView, setEditingIndexView] = useState<number | null>(null)

  // Form data for Add tab
  const [formData, setFormData] = useState({
    academic_year: "",
    term_name: "",
    term_start_date: "",
    term_end_date: "",
  })

  // Form data for View tab
  const [formDatas, setFormDatas] = useState({
    academic_year: "",
    term_name: "",
    term_start_date: "",
    term_end_date: "",
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

  // Add/Update academicTerm in Add tab
  const addOrUpdateacademicTerms = (e: any) => {
    e.preventDefault()
    if (editingIndexAdd !== null) {
      const updated = [...academicTerms]
      updated[editingIndexAdd] = { ...formData }
      setacademicTerms(updated)
      setEditingIndexAdd(null)
    } else {
      setacademicTerms([...academicTerms, { ...formData }])
    }
    setFormData({ academic_year: "", term_name: "", term_start_date: "", term_end_date: "" })
  }

  // Add/Update academicTerm in View tab
  const addOrUpdateacademicTerm = (e: any) => {
    e.preventDefault()
    if (editingIndexView !== null) {
      const updated = [...academicTerm]
      updated[editingIndexView] = { ...formDatas }
      setacademicTerm(updated)
      setEditingIndexView(null)
    } else {
      setacademicTerm([...academicTerm, { ...formDatas }])
    }
    setFormDatas({ academic_year: "", term_name: "", term_start_date: "", term_end_date: "" })
  }

  // Edit handlers
  const handleEdit = (index: number) => {
    setFormData(academicTerms[index])
    setEditingIndexAdd(index)
  }

  const handleEdits = (index: number) => {
    setFormDatas(academicTerm[index])
    setEditingIndexView(index)
  }

  // Delete handlers
  const handleDelete = (index: number) => {
    setacademicTerms(academicTerms.filter((_, i) => i !== index))
    if (editingIndexAdd === index) setEditingIndexAdd(null)
  }

  const handleDelets = (index: number) => {
    setacademicTerm(academicTerm.filter((_, i) => i !== index))
    if (editingIndexView === index) setEditingIndexView(null)
  }

  //for saving academicTerms added in Add tab
  const saveacademicTerms = (e: any) => {
    e.preventDefault()
    if (academicTerms.length === 0) {
      toast.error("No academic terms to save.")
      return
    }
    setIsLoading(true)
    api.post("school_app.services.rest.create_academic_term", JSON.stringify(academicTerms))
      .then((res) => {
        setIsLoading(false)
        setRefresh(prev => !prev)
        toast.success(res.data?.message?.message)
        setacademicTerms([])
      })
      .catch((err) => {
        setIsLoading(false)
        toast.error(err.response?.data?.message?.message)
      })
  }

  //for  updating academicTerms in View tab
  const updateacademicTerms = (e: any) => {
    e.preventDefault()
    if (academicTerm.length === 0) {
      toast.error("No data to update.")
      return
    }
    console.log("academicTerm", JSON.stringify(academicTerm))
    setIsLoading(true)
    api.post("school_app.services.rest.update_academic_term", JSON.stringify(academicTerm))
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
    const fetchacademicTerms = async () => {
      api.get("school_app.services.rest.get_academic_years")
        .then((res) => {
          setIsLoading(false)
          const data = res.data?.message?.data || []
          if (data.length > 0) setAcademicYear(data)
        })
        .catch((err) => {
          setIsLoading(false)
          toast.error(err.response?.data?.message)
        })
    }
    fetchacademicTerms()
  }, [refresh])

  useEffect(() => {
    setIsLoading(true)
    api.get("school_app.services.rest.get_academic_terms")
      .then((res) => {
        setIsLoading(false)
        const data = res.data?.message?.data || []
        setacademicTerm(data)
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
          <TabsTrigger value="add">Add New Academic Term</TabsTrigger>
          <TabsTrigger value="view">View All Academic Terms</TabsTrigger>
        </TabsList>

        {/* Add Tab */}
        <TabsContent value="add" className="w-full">
          <form onSubmit={addOrUpdateacademicTerms}>
            <Card>
              <CardHeader>
                <CardTitle>{editingIndexAdd !== null ? "Edit academicTerm" : "Create New Term"}</CardTitle>
                <CardDescription>Enter data below and click {editingIndexAdd !== null ? "Update" : "Add"}.</CardDescription>
              </CardHeader>

              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="term_name">Term Name<span className="text-red-800"> *</span></Label>
                  <Input
                    name="term_name"
                    value={formData.term_name}
                    required
                    onChange={handleChange}
                    placeholder="Enter term name"
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Term Start Date</Label>
                  <Calendar22
                    date={formData.term_start_date ? new Date(formData.term_start_date) : undefined}
                    onSelect={(date: Date) => setFormData(prev => ({
                      ...prev,
                      term_start_date: format(date, "yyyy-MM-dd")
                    }))}
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Term Year End Date</Label>
                  <Calendar22
                    date={formData.term_end_date ? new Date(formData.term_end_date) : undefined}
                    onSelect={(date: Date) => setFormData(prev => ({
                      ...prev,
                      term_end_date: format(date, "yyyy-MM-dd")
                    }))}
                  />
                </div>

                 <div className="grid gap-3">
                      <Label htmlFor="academic_year_name">Academic Year</Label>
                      <Select
                        name="academic_year_name"
                        onValueChange={(val) => setFormData((prev) => ({ ...prev, academic_year: val }))}
                        value={formData.academic_year}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicYear.length > 0 ? academicYear.map((academic) => (
                            <SelectItem key={academic.name} value={academic.name}>
                              {academic.academic_year_name}
                            </SelectItem>
                          )) : (
                            <SelectItem value="none" disabled>No academic available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
              </CardContent>

              <CardFooter>
                {isLoading ? <Spinner /> : <Button type="submit">{editingIndexAdd !== null ? "Update Academic Term" : "Add Academic Term"}</Button>}
              </CardFooter>
            </Card>
          </form>
          <AcademicTermTable data={academicTerms} onEdit={handleEdit} onDelete={handleDelete} purpose="add" />
          {isLoading ? <Spinner /> : <Button onClick={saveacademicTerms} className="md:mt-4 sm:mt-2">Save Academic Term/s</Button>}
        </TabsContent>

        {/* View Tab */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Here Are All Academic Term</CardTitle>
              <CardDescription>This is a list of academic term</CardDescription>
            </CardHeader>

            <CardContent className="grid md:grid-cols-1 gap-6">
              <form onSubmit={addOrUpdateacademicTerm}>
                <Card>
                  <CardHeader>
                    <CardTitle>{editingIndexView !== null ? "Edit Academic Term" : "Add Academic Term"}</CardTitle>
                    <CardDescription>Enter data below and click {editingIndexView !== null ? "Update" : "Add"}.</CardDescription>
                  </CardHeader>

                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="term_name">Term Name<span className="text-red-800"> *</span></Label>
                      <Input
                        name="term_name"
                        value={formDatas.term_name}
                        required
                        onChange={handleChangeView}
                        placeholder="Enter term name"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label>Term Start Date</Label>
                      <Calendar22
                        date={formDatas.term_start_date ? new Date(formDatas.term_start_date) : undefined}
                        onSelect={(date: Date) => setFormDatas(prev => ({
                          ...prev,
                          term_start_date: format(date, "yyyy-MM-dd")
                        }))}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label>Term Year End Date</Label>
                      <Calendar22
                        date={formDatas.term_end_date ? new Date(formDatas.term_end_date) : undefined}
                        onSelect={(date: Date) => setFormDatas(prev => ({
                          ...prev,
                          term_end_date: format(date, "yyyy-MM-dd")
                        }))}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="academic_year_name">Academic Year</Label>
                      <Select
                        name="academic_year_name"
                        onValueChange={(val) => setFormDatas((prev) => ({ ...prev, academic_year: val }))}
                        value={formDatas.academic_year}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicYear.length > 0 ? academicYear.map((academic) => (
                            <SelectItem key={academic.name} value={academic.name}>
                              {academic.academic_year_name}
                            </SelectItem>
                          )) : (
                            <SelectItem value="none" disabled>No academic available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>

                  <CardFooter>
                    {isLoading ? <Spinner /> : <Button type="submit" disabled={editingIndexView == null}>Update academicTerm</Button>}
                  </CardFooter>
                </Card>
              </form>
              <AcademicTermTable data={academicTerm} onEdit={handleEdits} onDelete={handleDelets} purpose="view" />
            </CardContent>

            <CardFooter>
              {isLoading ? <Spinner /> : <Button onClick={updateacademicTerms} >Submit academicTerm</Button>}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
