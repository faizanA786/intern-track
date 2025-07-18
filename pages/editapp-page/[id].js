import EditApplication from "../../components/EditApplication";
import { useRouter } from "next/router";

export default function Route() {
    const router = useRouter(); 
    const { id } = router.query; // grab dynamic part of URL [id]

    if (!id) {
        return <div>Loading...</div>
    }

    return <EditApplication id={id} />;
}