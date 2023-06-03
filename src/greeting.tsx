export const Greeting: React.FC<{ name: string }> = (props) => {
  return <p>{`Hello, ${props.name}!`}</p>;
};
