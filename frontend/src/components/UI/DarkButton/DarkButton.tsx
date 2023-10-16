import './DarkButton.css';
import IDarkButtonProps from './IDarkButtonProps';

const DarkButton: React.FunctionComponent<IDarkButtonProps> = (props: IDarkButtonProps) => {
    return (
        <button
            onClick={props.click === undefined ? undefined : props.click}
            className={'DarkButton'}
            disabled={props.disabled === undefined ? false : props.disabled}
        >
            {props.label}
        </button>
    );
};

export default DarkButton;