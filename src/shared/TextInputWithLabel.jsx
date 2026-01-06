function TextInputWithLabel({ elementId, label, value, onChange, ref }) {
  return (
    <>
      <label htmlFor={elementId}>{label}</label>
      <input
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
