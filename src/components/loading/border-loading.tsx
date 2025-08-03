import styles from './border-loading.module.scss'
import { useNavigation } from 'react-router'

interface BorderLoadingProps{
    mode?: string
}
export default function BorderLoading({mode}: BorderLoadingProps){
    const navigation = useNavigation()
    return(
        navigation.state === 'loading' || mode === 'dev' && 
        <div className='flex justify-center items-center flex-col'>
            <div className={styles.loading}></div>
        </div>
    )
}