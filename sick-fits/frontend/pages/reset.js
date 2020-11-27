import Reset from '../components/Reset';

const ResetPasswordPage = props => (
    <div>
        <Reset resetToken={props.query.resetToken} />
    </div>
)

export default ResetPasswordPage;