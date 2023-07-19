import React, { useEffect } from 'react'

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function Button({text, onClick}) {
  return (<>
   <button className='w-full transition-all text-left p-2 rounded-md text-gray-800 hover:bg-slate-100' onClick={() => {
    onClick();
   }}>{text}</button>
  </>)
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function ContextMenu({
  position,
  content
}) {


  return (
    <div className={`absolute p-2 z-[999] w-[200px] bg-white rounded-md gap-4`} style={{
      top: `${position.y - 70}px`,
      left: `${position.x}px`,
      animationDuration: '0.2s'
    }}>
      <ul>
        <li>{content ? <Button text={'Copy'} onClick={() => {
          window.menu.copy(content)
        }}/> : <span className='p-2 w-full'>Copy</span>}</li>
        <li>{content ? <Button text={'Paste'} onClick={() => {

        }}/> : <span className='p-2 w-full'>Paste</span>}</li>

      </ul>
    </div>
  )
}
