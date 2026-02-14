// import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground" style={{background: 'white'}}>
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <img src="https://upload.wikimedia.org/wikipedia/id/a/a2/Logo_Binus_University.png" alt="BNCC" className="size-5"  />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    BNCC Mid Project
                </span>
            </div>
        </>
    );
}
