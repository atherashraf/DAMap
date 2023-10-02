import * as React from "react";
import { Autocomplete, TextField } from "@mui/material";
import autoBind from "auto-bind";

interface IProps {
  data: any;
  optionLabelKey: string;
  inputLabel: string;
  onChange: (selectedOption: any) => void;
}

interface IState {}

class TypeAhead extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    autoBind(this);
  }

  // handleOnChange(event: any, option: any) {
  //   this.setState((state) => ({
  //     selectedOption: option,
  //   }));
  // }

  render() {
    const { data, inputLabel, optionLabelKey } = this.props;

    return (
      <>
        <Autocomplete
          disablePortal
          id={"type-ahead-" + inputLabel}
          options={data}
          // @ts-ignore
          PopperProps={{
            style: {
              // Add custom styles to the Popper component
              zIndex: 9999, // Example custom style
            },
          }}
          //@ts-ignore
          onChange={(e, option) => this.props.onChange(option)}
          //@ts-ignore
          getOptionLabel={(option) => option[optionLabelKey]}
          sx={{ width: "85%", m: 1, overflow: "scroll" }}
          renderInput={(params) => <TextField {...params} label={inputLabel} />}
        />
      </>
    );
  }
}

export default TypeAhead;
