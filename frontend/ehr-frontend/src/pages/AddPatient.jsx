import { useState } from "react";
import axios from "axios";

function AddPatient(){

const [userId,setUserId] = useState("");
const [age,setAge] = useState("");
const [gender,setGender] = useState("");

const submit = async(e)=>{

e.preventDefault();

await axios.post(
"http://127.0.0.1:5000/patients",
{
user_id:userId,
age:age,
gender:gender
}
);

alert("Patient created");

};

return(

<div className="p-8">

<h1 className="text-3xl font-bold mb-6">
Add Patient
</h1>

<form
onSubmit={submit}
className="bg-white p-6 rounded shadow max-w-md space-y-4"
>

<input
placeholder="User ID"
className="border p-2 w-full"
value={userId}
onChange={(e)=>setUserId(e.target.value)}
required
/>

<input
placeholder="Age"
className="border p-2 w-full"
value={age}
onChange={(e)=>setAge(e.target.value)}
required
/>

<input
placeholder="Gender"
className="border p-2 w-full"
value={gender}
onChange={(e)=>setGender(e.target.value)}
required
/>

<button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
Create Patient
</button>

</form>

</div>

)

}

export default AddPatient