import styled from "styled-components";

/* Styled components */
const StyledLabel = styled.label`
  padding: 4px;
`;

const StyledInput = styled.input`
  padding: 4px;
`;

function TextInputWithLabel({ elementId, label, value, onChange, ref }) {
  return (
    <>
      <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
