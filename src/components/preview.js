import React from "react";

class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef()
    }

    setImageData(imageData) {
        this.canvasRef.current.width = imageData.width
        this.canvasRef.current.height = imageData.height
        const ctx = this.canvasRef.current.getContext('2d')
        ctx.putImageData(imageData, 0, 0)
    }

    getImageData() {
        return this.canvasRef.current.getContext('2d').getImageData(0, 0, this.canvasRef.current.width, this.canvasRef.current.height)
    }

    createImageData() {
        return this.canvasRef.current.getContext('2d').createImageData(this.canvasRef.current.width, this.canvasRef.current.height)
    }

    getContext = () => {
        return this.canvasRef.current.getContext('2d')
    }

    getCanvas = () => {
        return this.canvasRef.current
    }

    clear = () => {
        this.canvasRef.current.getContext('2d').clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height)
    }

    render() {
        return (
            <canvas ref={this.canvasRef} style={{maxWidth: 700, maxHeight:700}}/>
        )
    }

}

export default Preview