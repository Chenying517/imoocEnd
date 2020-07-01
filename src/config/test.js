import { setValue, getValue ,getHValue,delValue} from './ReidsConfig'

setValue('immoc', 'immoc set redis value')

getValue('immoc').then((res) => {
  console.log('getValue'+res)
})

setValue('immoc2', { name: 'cy',yeras:'34'})

getHValue('immoc2').then((res) => {
  console.log(JSON.stringify(res,null, 2))
})
