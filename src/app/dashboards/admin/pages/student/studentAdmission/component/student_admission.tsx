"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/lib/axios"
import toast, { Toaster } from "react-hot-toast"
import { Spinner } from "@/components/ui/spinner"
import { StudentAdmission, StudentAdmissionTable } from "./student_admission_table"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar22 } from "../../../configurations/academicYear/component/calendar"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import "../style.css"
import { StudentAdmissionProgram, StudentAdmissionProgramTable } from "./student_admission_program_table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
interface Program {
  name: string;
  program_name: String;
  program_abbreviation: String;
  department: String;
  hero_image: String;
}
interface AcademicYear {
  name: string;
  academic_year_name: string;
  year_start_date: string | null;
  year_end_date: string;

}
export function TabsStudentAdmission() {
  const [studentAdmissionDatas, setstudentAdmissionDatas] = useState<StudentAdmission[]>([])
  const [studentAdmissionData, setstudentAdmissionData] = useState<StudentAdmissionProgram[]>([])
  const [program, setProgram] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [academicYear, setAcademicYear] = useState<AcademicYear[]>([])
  const [refresh, setRefresh] = useState(false)
  const [editingIndexAdd, setEditingIndexAdd] = useState<number | null>(null)
  const [editingIndexView, setEditingIndexView] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    academic_year: "",
    admission_end_date: "",
    admission_start_date: "",
    introduction: "",
    enable_admission_application: "",
  })

  const [formDatas, setFormDatas] = useState({
    program: "",
    min_age: "",
    max_age: "",
    description: "",
    application_fee: ""
  })

  const handleChange = (e: any) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleChangeView = (e: any) => {
    const { name, value, files } = e.target
    setFormDatas((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const addOrUpdatestudentAdmissionDatas = (e: any) => {
    e.preventDefault()
    if (editingIndexAdd !== null) {
      const updated = [...studentAdmissionDatas]
      updated[editingIndexAdd] = { ...formData }
      setstudentAdmissionDatas(updated)
      setEditingIndexAdd(null)
    } else {
      setstudentAdmissionDatas([...studentAdmissionDatas, { ...formData }])
    }
    setFormData({ title: "", academic_year: "", admission_end_date: "", admission_start_date: "", introduction: "", enable_admission_application: "" })
  }

  const addOrUpdatestudentAdmissionData = (e: any) => {
    e.preventDefault()
    if (editingIndexView !== null) {
      const updated = [...studentAdmissionData]
      updated[editingIndexView] = { ...formDatas }
      setstudentAdmissionData(updated)
      setEditingIndexView(null)
    } else {
      setstudentAdmissionData([...studentAdmissionData, { ...formDatas }])
    }
    setFormDatas({ program: "", min_age: "", max_age: "", description: "", application_fee: "" })
  }

  const handleEdit = (index: number) => {
    setFormData(studentAdmissionDatas[index])
    setEditingIndexAdd(index)
  }

  const handleEdits = (index: number) => {
    setFormDatas(studentAdmissionData[index])
    setEditingIndexView(index)
  }


  const handleDelete = (index: number) => {
    setstudentAdmissionDatas(studentAdmissionDatas.filter((_, i) => i !== index))
    if (editingIndexAdd === index) setEditingIndexAdd(null)
  }

  const handleDelets = (index: number) => {
    setstudentAdmissionData(studentAdmissionData.filter((_, i) => i !== index))
    if (editingIndexView === index) setEditingIndexView(null)
  }

  const savestudentAdmissionDatas = (e: any) => {
    e.preventDefault()
    if (studentAdmissionDatas.length === 0) {
      toast.error("No academic terms to save.")
      return
    }
    setIsLoading(true)
    api
      .post("school_app.services.rest.create_student_title", JSON.stringify(studentAdmissionDatas))
      .then((res) => {
        setIsLoading(false)
        setRefresh((prev) => !prev)
        toast.success(res.data?.message?.message)
        setstudentAdmissionDatas([])
      })
      .catch((err) => {
        setIsLoading(false)
        toast.error(err.response?.data?.message?.message)
      })
  }

  const updatestudentAdmissionDatas = async (e: any) => {
    e.preventDefault()
    if (studentAdmissionData.length === 0 && studentAdmissionDatas.length === 0) {
      toast.error("No data to  submit.")
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        title: formData.title,
        academic_year: formData.academic_year,
        admission_start_date: formData.admission_start_date,
        admission_end_date: formData.admission_end_date,
        introduction: formData.introduction,
        enable_admission_application: formData.enable_admission_application === "1" ? 1 : 0,
        program_details: studentAdmissionData.map((program) => ({
          program: program.program,
          min_age: Number(program.min_age),
          max_age: Number(program.max_age),
          description: program.description,
          application_fee: Number(program.application_fee),
        })),

      }
      console.log("Payload:", payload) // Debugging line
      const res = await api.post(
        "school_app.services.rest.create_student_admission",
        JSON.stringify(payload)
      )

      setIsLoading(false)
      setRefresh((prev) => !prev)
      toast.success(res?.data?.message?.message || "Student admissions submitted successfully.")
    } catch (err: any) {
      setIsLoading(false)
      toast.error(
        err.response?.data?.message?.message || "Failed to submit student admissions."
      )
    }
  }
  useEffect(() => {
    setIsLoading(true)
    const fetchacademicTerms = async () => {
      api.get("school_app.services.rest.get_programs")
        .then((res) => {
          setIsLoading(false)
          const data = res.data?.message?.data || []
          if (data.length > 0) setProgram(data)
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

  return (
    <div className="flex w-full flex-col gap-6">
      <Toaster />

      <Tabs defaultValue="add">
        <TabsList className="md:mb-2 lg:mb-2">
          <TabsTrigger value="add">Add New Student Admission</TabsTrigger>
          <TabsTrigger value="view">View All Student Admissions</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-4">
          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General Details</TabsTrigger>
              <TabsTrigger value="program">Program Details</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="w-full">
              <form>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingIndexAdd !== null ? "Edit Student Admission" : "Create Student Admission"}
                    </CardTitle>
                    <CardDescription>
                      Enter data below and click {editingIndexAdd !== null ? "Update" : "Add"}.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="title">
                        Admission Name<span className="text-red-800"> *</span>
                      </Label>
                      <Input
                        name="title"
                        value={formData.title}
                        required
                        onChange={handleChange}
                        placeholder="Enter student admission"
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
                    <div className="grid gap-3">
                      <Label htmlFor="title">
                        Admission Start Date<span className="text-red-800"> *</span>
                      </Label>
                      <Calendar22
                        date={formData.admission_start_date ? new Date(formData.admission_start_date) : undefined}
                        onSelect={(date: Date) => setFormData(prev => ({
                          ...prev,
                          admission_start_date: format(date, "yyyy-MM-dd")
                        }))}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="title">
                        Admission End Date<span className="text-red-800"> *</span>
                      </Label>
                      <Calendar22
                        date={formData.admission_end_date ? new Date(formData.admission_end_date) : undefined}
                        onSelect={(date: Date) => setFormData(prev => ({
                          ...prev,
                          admission_end_date: format(date, "yyyy-MM-dd")
                        }))}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="title">
                        Admission Description<span className="text-red-800"> *</span>
                      </Label>
                      <Textarea onChange={handleChange} value={formData.introduction} name="introduction" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enable_admission_application"
                        checked={formData.enable_admission_application === "1"}
                        onCheckedChange={(checked) => {
                          setFormData((prev) => ({
                            ...prev,
                            enable_admission_application: checked ? "1" : "0",
                          }))
                        }}
                      />
                      <Label htmlFor="enable_admission_application">Enable Admission Application</Label>
                    </div>

                  </CardContent>

                  <CardFooter>
                    {/* {isLoading ? <Spinner /> : <Button type="submit">Save Student Admission</Button>} */}
                  </CardFooter>
                </Card>
              </form>

              {/* <StudentAdmissionTable
                data={studentAdmissionDatas}
                onEdit={handleEdit}
                onDelete={handleDelete}
                purpose="add"
              /> */}
            </TabsContent>

            <TabsContent value="program">
              <Card>
                <CardHeader>
                  <CardTitle>Here Are All Student Admissions</CardTitle>
                  <CardDescription>This is a list of Student Admissions.</CardDescription>
                </CardHeader>

                <CardContent className="grid md:grid-cols-1 gap-6">
                  <form onSubmit={addOrUpdatestudentAdmissionData}>
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {editingIndexView !== null ? "Edit Student Admission" : "Add Student Admission Program"}
                        </CardTitle>
                        <CardDescription>
                          Enter data below and click {editingIndexView !== null ? "Update" : "Add"}.
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="program">Program</Label>
                          <Select
                            name="program"
                            onValueChange={(val) => setFormDatas((prev) => ({ ...prev, program: val }))}
                            value={formDatas.program}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select academic year" />
                            </SelectTrigger>
                            <SelectContent>
                              {program.length > 0 ? program.map((program) => (
                                <SelectItem key={program.name} value={program.name}>
                                  {program.program_name}
                                </SelectItem>
                              )) : (
                                <SelectItem value="none" disabled>No academic available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="title">
                            Minimum Age<span className="text-red-800"> *</span>
                          </Label>
                          <Input
                            name="min_age"
                            value={formDatas.min_age}
                            required
                            onChange={handleChangeView}
                            placeholder="Enter student minimum age"
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="title">
                            Maximum Required Age<span className="text-red-800"> *</span>
                          </Label>
                          <Input
                            name="max_age"
                            value={formDatas.max_age}
                            required
                            onChange={handleChangeView}
                            placeholder="Enter student maximum age"
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="title">
                            Application Fee<span className="text-red-800"> *</span>
                          </Label>
                          <Input
                            name="application_fee"
                            value={formDatas.application_fee}
                            required
                            onChange={handleChangeView}
                            placeholder="Enter application fee"
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="title">
                            Program Description<span className="text-red-800"> *</span>
                          </Label>
                          <Textarea onChange={handleChangeView} value={formDatas.description} name="description" />
                        </div>
                      </CardContent>

                      <CardFooter>
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <Button type="submit">
                            Add Program
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </form>

                  <StudentAdmissionProgramTable
                    data={studentAdmissionData}
                    onEdit={handleEdits}
                    onDelete={handleDelets}
                    purpose="view"
                  />
                </CardContent>

                <CardFooter>
                  {isLoading ? <Spinner /> : <Button onClick={updatestudentAdmissionDatas}>Submit Student Admission</Button>}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="view" className="mt-4">
        </TabsContent>
      </Tabs>
    </div>
  )
}
