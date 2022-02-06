import { useEffect } from 'react';

function resizeable() {
    document.querySelectorAll('.resizer').forEach(resizer => {
        const direction = resizer.getAttribute('direction') || 'horizontal'
        const prevSibling = resizer.previousElementSibling
        const nextSibling = resizer.nextElementSibling

        let x = 0
        let y = 0
        let prevSiblingHeight = 0
        let prevSiblingWidth = 0

        function mouseDownHandler(e) {
            x = e.clientX;
            y = e.clientY;
            const rect = prevSibling.getBoundingClientRect();
            prevSiblingHeight = rect.height;
            prevSiblingWidth = rect.width;
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        }

        function mouseMoveHandler(e) {
            const dx = e.clientX - x;
            const dy = e.clientY - y;
            if(direction === 'vertical')
                prevSibling.style.height = `${((prevSiblingHeight + dy) * 100) / resizer.parentNode.getBoundingClientRect().height}%`
            if(direction === 'horizontal')
                prevSibling.style.width = `${((prevSiblingWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width}%`
            const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize'
            resizer.style.cursor = cursor
            document.body.style.cursor = cursor
            prevSibling.style.userSelect = 'none'
            prevSibling.style.pointerEvents = 'none'
            nextSibling.style.userSelect = 'none'
            nextSibling.style.pointerEvents = 'none'
        }

        function mouseUpHandler() {
            resizer.style.removeProperty('cursor')
            document.body.style.removeProperty('cursor')
            prevSibling.style.removeProperty('user-select')
            prevSibling.style.removeProperty('pointer-events')
            nextSibling.style.removeProperty('user-select')
            nextSibling.style.removeProperty('pointer-events')
            document.removeEventListener('mousemove', mouseMoveHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }
        resizer.addEventListener('mousedown', mouseDownHandler)
    })
}

export function ResizableV({top, bottom, sizeTop}) {
    useEffect(resizeable)
    return <div className='resizableWrapper vertical'>
        <div className='resizableContainer top' style={{height: sizeTop}}>{top}</div>
        <div className='resizer' direction='vertical'></div>
        <div className='resizableContainer bottom'>{bottom}</div>
    </div>
}

export function ResizableH({left, right, sizeLeft}) {
    useEffect(resizeable)
    return <div className='resizableWrapper horizontal'>
        <div className='resizableContainer left' style={{width: sizeLeft}}>{left}</div>
        <div className='resizer' direction='horizontal'></div>
        <div className='resizableContainer right'>{right}</div>
    </div>
}

export function ResizeTest() {
    useEffect(resizeable)
    return <div style={{height: '100vh', userSelect: 'none'}}>
        <ResizableH left={
            <ResizableV top={
                <ResizableH left={<ResizableV top={1} bottom={2}/>}
                    right={<ResizableV top={3} bottom={4}/>}/>
            } bottom={
                <ResizableH left={<ResizableV top={5} bottom={6}/>}
                    right={<ResizableV top={7} bottom={8}/>}/>
            }/>
        } right={
            <ResizableV top={
                <ResizableH left={<ResizableV top={9} bottom={10}/>}
                    right={<ResizableV top={11} bottom={12}/>}/>
            } bottom={
                <ResizableH left={<ResizableV top={13} bottom={14}/>}
                    right={<ResizableV top={15} bottom={16}/>}/>
            }/>
        }/>
    </div>
}
