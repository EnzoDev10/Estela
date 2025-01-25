import './App.css';

import { SnippetEditor, SnippetList, SnippetForm } from './components/index';

function App() {
	return (
		<div className="bg-neutral-950 h-screen text-white grid grid-cols-12">
			<div className="col-span-3 bg-teal-900">
				<SnippetForm />
				<SnippetList />
			</div>
			<div className="col-span-9 bg-teal-950 flex justify-center items-center">
				<SnippetEditor />
			</div>
		</div>
	);
}

export default App;
