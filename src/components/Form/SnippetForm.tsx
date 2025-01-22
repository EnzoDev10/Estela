export const SnippetForm = () => {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				alert('form submitted');
			}}
			action=""
		>
			<input
				className="bg-zinc-900 w-full border-none outline-none p-4"
				type="text"
				placeholder="escribe un snippet"
			/>
			<button className="hidden">Save</button>
		</form>
	);
};
