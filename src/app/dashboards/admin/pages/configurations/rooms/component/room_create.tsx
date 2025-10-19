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
import { RoomData, AcademicRoomTable } from "./room_table"
import { Calendar22 } from "../../academicYear/component/calendar"
import { format } from "date-fns"

export function TabsRoom() {
  const [roomDatas, setroomDatas] = useState<RoomData[]>([])        // Add tab data
  const [roomData, setroomData] = useState<RoomData[]>([])          // View tab data
  const [isLoading, setIsLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  // Separate editing indices for Add and View tabs
  const [editingIndexAdd, setEditingIndexAdd] = useState<number | null>(null)
  const [editingIndexView, setEditingIndexView] = useState<number | null>(null)

  // Form data for Add tab
  const [formData, setFormData] = useState({
    room_name: "",
    room_number: "",
    seating_capacity: "",
  })

  // Form data for View tab
  const [formDatas, setFormDatas] = useState({
   room_name: "",
    room_number: "",
    seating_capacity: "",
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

  // Add/Update roomData in Add tab
  const addOrUpdateroomDatas = (e: any) => {
    e.preventDefault()
    if (editingIndexAdd !== null) {
      const updated = [...roomDatas]
      updated[editingIndexAdd] = { ...formData }
      setroomDatas(updated)
      setEditingIndexAdd(null)
    } else {
      setroomDatas([...roomDatas, { ...formData }])
    }
    setFormData({ room_name: "", room_number: "", seating_capacity: ""})
  }

  // Add/Update roomData in View tab
  const addOrUpdateroomData = (e: any) => {
    e.preventDefault()
    if (editingIndexView !== null) {
      const updated = [...roomData]
      updated[editingIndexView] = { ...formDatas }
      setroomData(updated)
      setEditingIndexView(null)
    } else {
      setroomData([...roomData, { ...formDatas }])
    }
    setFormDatas({ room_name: "", room_number: "", seating_capacity: ""})
  }

  // Edit handlers
  const handleEdit = (index: number) => {
    setFormData(roomDatas[index])
    setEditingIndexAdd(index)
  }

  const handleEdits = (index: number) => {
    setFormDatas(roomData[index])
    setEditingIndexView(index)
  }

  // Delete handlers
  const handleDelete = (index: number) => {
    setroomDatas(roomDatas.filter((_, i) => i !== index))
    if (editingIndexAdd === index) setEditingIndexAdd(null)
  }

  const handleDelets = (index: number) => {
    setroomData(roomData.filter((_, i) => i !== index))
    if (editingIndexView === index) setEditingIndexView(null)
  }

  //for saving roomDatas added in Add tab
  const saveroomDatas = (e: any) => {
    e.preventDefault()
    if (roomDatas.length === 0) {
      toast.error("No academic terms to save.")
      return
    }
    setIsLoading(true)
    api.post("school_app.services.rest.create_room", JSON.stringify(roomDatas))
      .then((res) => {
        setIsLoading(false)
        setRefresh(prev => !prev)
        toast.success(res.data?.message?.message)
        setroomDatas([])
      })
      .catch((err) => {
        setIsLoading(false)
        toast.error(err.response?.data?.message?.message)
      })
  }

  //for  updating roomDatas in View tab
  const updateroomDatas = (e: any) => {
    e.preventDefault()
    if (roomData.length === 0) {
      toast.error("No data to update.")
      return
    }
    console.log("roomData", JSON.stringify(roomData))
    setIsLoading(true)
    api.post("school_app.services.rest.update_room", JSON.stringify(roomData))
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
    api.get("school_app.services.rest.get_all_rooms")
      .then((res) => {
        setIsLoading(false)
        const data = res.data?.message?.data || []
        setroomData(data)
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
          <TabsTrigger value="add">Add New Room</TabsTrigger>
          <TabsTrigger value="view">View All Rooms</TabsTrigger>
        </TabsList>

        {/* Add Tab */}
        <TabsContent value="add" className="w-full">
          <form onSubmit={addOrUpdateroomDatas}>
            <Card>
              <CardHeader>
                <CardTitle>{editingIndexAdd !== null ? "Edit roomData" : "Create New Room"}</CardTitle>
                <CardDescription>Enter data below and click {editingIndexAdd !== null ? "Update" : "Add"}.</CardDescription>
              </CardHeader>

              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="room_name">Room Name<span className="text-red-800"> *</span></Label>
                  <Input
                    name="room_name"
                    value={formData.room_name}
                    required
                    onChange={handleChange}
                    placeholder="Enter room name"
                  />
                </div>
                 <div className="grid gap-3">
                  <Label htmlFor="room_number">Room Number<span className="text-red-800"> *</span></Label>
                  <Input
                    name="room_number"
                    value={formData.room_number}
                    required
                    onChange={handleChange}
                    placeholder="Enter room number"
                  />
                </div>
                 <div className="grid gap-3">
                  <Label htmlFor="seating_capacity">Room Capacity NO<span className="text-red-800"> *</span></Label>
                  <Input
                    name="seating_capacity"
                    value={formData.seating_capacity}
                    required
                    onChange={handleChange}
                    placeholder="Enter room capacity"
                  />
                </div>
              </CardContent>

              <CardFooter>
                {isLoading ? <Spinner /> : <Button type="submit">{editingIndexAdd !== null ? "Update Room" : "Add Room"}</Button>}
              </CardFooter>
            </Card>
          </form>
          <AcademicRoomTable data={roomDatas} onEdit={handleEdit} onDelete={handleDelete} purpose="add" />
          {isLoading ? <Spinner /> : <Button onClick={saveroomDatas} className="md:mt-4 sm:mt-2">Save Academic Term/s</Button>}
        </TabsContent>

        {/* View Tab */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Here Are All Rooms</CardTitle>
              <CardDescription>This is a list of rooms</CardDescription>
            </CardHeader>

            <CardContent className="grid md:grid-cols-1 gap-6">
              <form onSubmit={addOrUpdateroomData}>
                <Card>
                  <CardHeader>
                    <CardTitle>{editingIndexView !== null ? "Edit Room" : "Add Room"}</CardTitle>
                    <CardDescription>Enter data below and click {editingIndexView !== null ? "Update" : "Add"}.</CardDescription>
                  </CardHeader>

                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                  <Label htmlFor="room_name">Room Name<span className="text-red-800"> *</span></Label>
                  <Input
                    name="room_name"
                    value={formDatas.room_name}
                    required
                    onChange={handleChangeView}
                    placeholder="Enter room name"
                  />
                </div>
                 <div className="grid gap-3">
                  <Label htmlFor="room_number">Room Number<span className="text-red-800"> *</span></Label>
                  <Input
                    name="room_number"
                    value={formDatas.room_number}
                    required
                    onChange={handleChangeView}
                    placeholder="Enter room number"
                  />
                </div>
                 <div className="grid gap-3">
                  <Label htmlFor="seating_capacity">Room Capacity NO<span className="text-red-800"> *</span></Label>
                  <Input
                    name="seating_capacity"
                    value={formDatas.seating_capacity}
                    required
                    onChange={handleChangeView}
                    placeholder="Enter room capacity"
                  />
                </div>
                  </CardContent>

                  <CardFooter>
                    {isLoading ? <Spinner /> : <Button type="submit" disabled={editingIndexView == null}>Update Room</Button>}
                  </CardFooter>
                </Card>
              </form>
              <AcademicRoomTable data={roomData} onEdit={handleEdits} onDelete={handleDelets} purpose="view" />
            </CardContent>

            <CardFooter>
              {isLoading ? <Spinner /> : <Button onClick={updateroomDatas} >Submit Room</Button>}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
