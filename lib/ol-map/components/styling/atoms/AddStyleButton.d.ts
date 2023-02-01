/// <reference types="react" />
interface IMenuItem {
    name: string;
    handleClick: Function;
}
interface IProps {
    menuList: IMenuItem[];
}
export default function AddStyleButton(props: IProps): JSX.Element;
export {};
