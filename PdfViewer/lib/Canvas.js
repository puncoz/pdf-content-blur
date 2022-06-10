"use strict"
import { fabric }      from "fabric"
import blurredImageSrc from "./blurred-image.png"

const defaultOptions = {
    preserveObjectStacking: true,
    selection: true,
    defaultCursor: "default",
    backgroundColor: "#ffffff",
}

class Canvas {
    ref = null
    el = null
    options = {}
    width = 0
    height = 0

    isDrawing = false
    mouseX = 0
    mouseY = 0
    blurredImage = null

    constructor(el, options) {
        this.el = el
        this.options = { ...defaultOptions, ...options }
        this.calculateCanvasSize()

        this.init()
        this.bindEvents()

        fabric.Image.fromURL(blurredImageSrc, (img) => {
            this.blurredImage = img
        })
    }

    calculateCanvasSize() {
        const containerWidth = this.el.closest(".pdf-editor-container").offsetWidth

        this.width = containerWidth
        this.height = containerWidth * 1.4142
    }

    init() {
        this.ref = new fabric.Canvas(this.el, this.options)
    }

    bindEvents() {
        this.ref.on("mouse:down", e => this.onMouseDown(e))
        this.ref.on("mouse:move", e => this.onMouseMove(e))
        this.ref.on("mouse:up", e => this.onMouseUp(e))
        this.ref.on("object:moving", e => this.onObjectMoving(e))
    }

    unbindEvents() {
        this.ref.off("mouse:down")
        this.ref.off("mouse:move")
        this.ref.off("mouse:up")
        this.ref.off("mouse:moving")

        this.ref.dispose()
    }

    onMouseDown(o) {
        if (this.ref.getActiveObject()) {
            return
        }

        this.enableDrawing()

        const mouse = this.ref.getPointer(o.e)
        this.mouseX = mouse.x
        this.mouseY = mouse.y

        const img = fabric.util.object.clone(this.blurredImage)
        img.set("left", this.mouseX)
        img.set("top", this.mouseY)
        img.set("width", mouse.x - this.mouseX)
        img.set("height", mouse.y - this.mouseY)
        this.ref.add(img)
        this.ref.setActiveObject(img)
    }

    onMouseMove(o) {
        if (!this.isDrawingEnabled()) {
            return
        }

        const mouse = this.ref.getPointer(o.e)
        const activeRect = this.ref.getActiveObject()

        if (this.mouseX > mouse.x) {
            activeRect.set("left", Math.abs(mouse.x))
        }

        if (this.mouseY > mouse.y) {
            activeRect.set("top", Math.abs(mouse.y))
        }

        const w = Math.abs(this.mouseX - mouse.x)
        const h = Math.abs(this.mouseY - mouse.y)

        activeRect.set("width", w)
        activeRect.set("height", h)
        activeRect.setCoords()
        this.ref.renderAll()
    }

    onMouseUp(o) {
        const activeRect = this.ref.getActiveObject()
        const width = activeRect.getScaledWidth()
        const height = activeRect.getScaledHeight()

        if (!width && !height) {
            this.ref.remove(activeRect)
        }

        this.disableDrawing()
    }

    onObjectMoving(e) {
        this.disableDrawing()
    }

    getRef() {
        return this.ref
    }

    toJson() {
        return JSON.stringify(this.ref)
    }

    loadFromJson(canvasJson) {
        this.ref.loadFromJSON(canvasJson, () => {
            // making sure to render canvas at the end
            this.ref.renderAll()
        })
    }

    disableDrawing() {
        this.isDrawing = false
    }

    enableDrawing() {
        this.isDrawing = true
    }

    isDrawingEnabled() {
        return this.isDrawing
    }

    removeAll() {
        this.ref.remove(...this.ref.getObjects())
    }

    removeSelected() {
        this.ref.remove(this.ref.getActiveObject())
    }
}

export default Canvas
