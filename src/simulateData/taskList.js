let id = 0
const taskList = [
   { completed: true,  sort: 100, 
      title: "После добавления - очищать строку ввода" },
   { completed: true, sort: 200,
      title: "Убрать одновременное редактирование" },
   { completed: true, sort: 300,
      title: "Обработка клавиши esc" },
   { completed: true, sort: 300,
      title: "Режим редактировния при клике на доб. пункт" },
   { completed: false, sort: 300,
      title: "Drag'n'drop сортировка" },
].map( item => ({...item, id: id++}) )

export default taskList
