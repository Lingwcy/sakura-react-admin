import styles from './border-loading.module.scss'
import { useNavigation } from 'react-router'

interface BorderLoadingProps{
    mode?: string
    showAlways?: boolean // 新增属性，用于强制显示
}
export default function BorderLoading({mode, showAlways = false}: BorderLoadingProps){
    const navigation = useNavigation()

    // 如果 showAlways 为 true，或者满足原有条件，则显示加载组件
    const shouldShow = showAlways || navigation.state === 'loading' || mode === 'dev'

    return shouldShow ? (
        <div className='flex justify-center items-center flex-col h-screen'>
            <div className={styles.loading}></div>
            <p className='mt-4 text-gray-600'>加载中...</p>
        </div>
    ) : null
}