import styles from './border-loading.module.scss'

export default function AppLoading() {
    return (
        <div className='flex justify-center items-center flex-col h-screen bg-white'>
            <div className={styles.loading}></div>
            <p className='mt-4 text-gray-600'>应用加载中...</p>
        </div>
    )
}
