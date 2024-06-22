import {Link} from "react-router-dom";

export default function WebsiteFooter({links}) {
    return (
        <div
            className={`bg-primary-main text-primary-contrastText w-screen min-h-[300px] p-10`}>

            <div className={`flex justify-center items-start gap-4 max-w-screen-xl`}>
                {/*col 1*/}
                <div className={`w-[200px]`}>

                    <div className={`text-xl font-bold mb-4`}>
                        Links
                    </div>
                    <div className={`text-sm flex flex-col`}>
                        {links.map((link, index) => (
                            <Link to={link.path} className={`p-2 hover:underline`} key={index}>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                </div>

                {/*col 2*/}
                <div className={`w-[400px]`}>

                    <div className={`text-xl font-bold mb-4`}>
                        About
                    </div>
                    <div className={`text-sm`}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
                    </div>
                </div>

                {/*col 3*/}
                <div className={`w-[200px]`}>
                    <div className={`text-xl font-bold mb-4`}>
                        Contact
                    </div>
                    <div className={`text-sm`}>
                        <a href="tel:1234567890">123-456-7890</a>
                    </div>
                    <div className={`text-sm`}>
                        <a href="mailto:me@mycompany.com">me@mycompany.com</a>
                    </div>
                </div>
            </div>
        </div>
    )
}