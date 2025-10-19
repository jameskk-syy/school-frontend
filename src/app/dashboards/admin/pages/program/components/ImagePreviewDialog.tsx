"use client"

import * as React from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ImagePreviewDialogProps {
  title: string
  image: string
}

export function ImagePreviewDialog({ title, image }: ImagePreviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">👁️</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <img src={image} alt={title} className="w-full h-auto rounded-md mt-2" />
        <DialogClose asChild>
          <Button className="mt-2 w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
