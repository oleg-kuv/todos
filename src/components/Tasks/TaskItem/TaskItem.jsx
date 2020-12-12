import React from 'react';
import './style.scss'

import completedImg from '../../../assets/img/tick-sign.svg'
import nonCompletegImg from '../../../assets/img/in-work.svg'
import editImg from '../../../assets/img/edit.svg'
import removeImg from '../../../assets/img/remove.svg'

const TaskItem = class extends React.Component{
   constructor (props) {
      super  ( props )

      let titleBuffer = this.props.title
      this.state={
         title: this.props.title
      }
      this.toggleEditButtonHandler = this.toggleEditButtonHandler.bind(this)
      this.editOn = this.editOn.bind(this)
      this.toggleCompletedMode = this.toggleCompletedMode.bind(this)
      this.removeFromTaskList = this.removeFromTaskList.bind(this)
      this.titleChangeHandler = this.titleChangeHandler.bind(this)
      this.keyHandler = this.keyHandler.bind(this)
   }

   // После рендера
   componentDidMount() { 
      // анимиция добавления нового пункта
      if ( this.props.state.new ) {
         setTimeout ( ()=>{ 
            this.updateTask ({
               id: this.props.id,
            }, {
               new: false
            })
         }, 50)
      }
   }

   // После обновления
   componentDidUpdate(prevProps, prevState) {
   }

// Функции компонента

   //Установить режим редактирования/чтения
   setEditMode (mode, callBack = () => (true)) {
      if ( mode === undefined ) { console.error ( 'setEditMode (mode=? ...' ); return false }

      this.updateTask ({
         id: this.props.id
      }, {
         edit: mode
      })
   }

   editOn () {
      this.props.changeTaskHandler ({
         type: 'unsetEditModeAll'
      },() => {this.setEditMode(true)})
   }

   // Сменить режим редактирования на противоположный
   toggleEditButtonHandler () {
      if ( !this.props.state.edit) {
         this.editOn()       
      } else {
         if ( this.state.title  !== '' ) {
            if ( this.props.newAdder ) {
               this.updateTask (
                  {id: this.props.id, title: ''},
                  {edit: true, submited: true},
                  () => { this.addToTaskList( this.state.title, this.props.completed ) }
               )
               
            } else {
               this.updateTask ({
                  id: this.props.id,
                  title: this.state.title,
               },{
                  edit: false
               })
            }
         } else {
            this.removeFromTaskList(this.props.id)
         }
      }
   }

   // Установить метку завершенности
   toggleCompletedMode () {
      this.updateTask ({
         id: this.props.id,
         completed: !this.props.completed
      })
   }

   // Добавить этот стейт в общий список
   addToTaskList (title, completed) {
      this.props.changeTaskHandler( {
         type: 'add',
         payload: {
            title: title,
            completed: completed,
            state: {
               edit: false,
               new: true
            }
         }
      }, () => {
         if ( this.props.state.submited ) {
               this.setState({...this.state, title: ''})
               this.updateTask (
                  {id: this.props.id, title: ''},
                  {submited: false}
               )
         }
      } )
   }

   // Удалить этот стейт из общего спиcка
   removeFromTaskList () {
      if ( !this.props.newAdder ) {
         // Включить режим удаления
         this.updateTask (
            {id: this.props.id},
            {removed: true},
            () => {
               // Удалить из списка после проигрывания анимации
               setTimeout ( ()=>{ 
                  this.props.changeTaskHandler ({
                     type: "remove",
                     payload: {
                        id: this.props.id
                     }
                  }) 
               }, 300 )
            }
         )
      }
   }

   titleChangeHandler (e) {
      this.setState ( {
         ...this.state,
         title: e.target.value
      } )
   }

   keyHandler(e) {
      if ( e.key === 'Enter' ) this.toggleEditButtonHandler()
      if ( e.key === 'Escape' ) {
         this.setState ({
            ...this.state,
            title: this.props.title
         }, () => this.toggleEditButtonHandler ())
      }
   }

   updateTask (taskProps, taskState, afterStateUpdateCbk = () => (true)) {
      this.props.changeTaskHandler ({
         type: "update",
         payload: {
            ...taskProps,
            state: {
               ...this.props.state,
               ...taskState
            }
         }
      }, afterStateUpdateCbk)
   }

   // render
   render () {
      const arrClassNames = [
         "taskItem",
         this.props.completed || this.props.state.completed ? 'taskItem__completed' : 'taskItem__non-completed',
         this.props.state.edit ? 'taskItem__edit' : undefined,
         this.props.state.removed ? 'taskItem__removed' : undefined,
         this.props.newAdder ? 'taskItem__newAdder' : undefined,
         this.props.state.new ? 'taskItem__new' : undefined,
      ]

      const completedSrc=this.props.completed || this.props.state.completed ? completedImg : nonCompletegImg

      return <div id={'task_'+this.props.id} className={arrClassNames.join(' ')}>
         <div className="state" onClick={this.toggleCompletedMode}><img src={completedSrc} alt="" /></div>
         <div className="edit" onClick={this.toggleEditButtonHandler}><img src={editImg} alt="" /></div>
         <div className="remove" onClick={this.removeFromTaskList} ><img src={removeImg} alt="" /></div>

         <div className="taskTitle"
            onClick={() => {
               if (this.props.newAdder && !this.props.state.edit) 
                  this.editOn()
            }}
         >
            {
            this.props.state.edit
               ? <input 
                   type="text"
                   value={this.state.title}
                   onChange={this.titleChangeHandler}
                   onKeyDown={this.keyHandler}
                   placeholder={this.props.placeholder}
                   autoFocus
                 />
               : this.props.title || this.props.placeholder
            }
            
         </div>
      </div>
   }
}

export default TaskItem
