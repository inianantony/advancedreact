import Permissions from '../components/Permissions';
import PleaseSignIn from '../components/PleaseSignIn';

const PermissionPage = props => (
    <div>
        <PleaseSignIn>
            <Permissions></Permissions>
        </PleaseSignIn>
    </div>
)

export default PermissionPage;