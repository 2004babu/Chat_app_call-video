import axios from "axios"
import { toast } from "react-toastify"

const sendToast = async (success?: string|null, err?: Error|null) => {

    console.log(success);
    
    if (success) {
        // toast.success(success,{
        //     position: "bottom-left",
        //     theme:'light'
        // })
    } else {
        if (axios.isAxiosError(err)) {
            return toast(err.response?.data.message)
        }
        toast.error((err as Error).message,{
            position: "top-center",
            theme:'light'
        })
    }

}

export default sendToast