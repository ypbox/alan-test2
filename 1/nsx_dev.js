// {Name: Basic_example_for_AI_assistant}
// {Description: Learn how to create a dialog script with voice/text commands and text corpus for question answering}

// Use this sample to create your own voice/text commands
// intent('hello world', p => {
//     p.play('(hello|hi there)');
// });


let userName = `admin`;
let password = `Admin!23Admin`;
let nsxManaggerUrl = `https://66.170.99.128:32801`;
let domain = `default`;


const proxy = {
    host: '34.173.180.160',
    port: 9876,
    auth: {username: 'alan', password: 'alanproxysecret'}
};

async function nsxApi({url}) {
    url = `${nsxManaggerUrl}${url}`;
    let auth = {
        username: userName,
        password: password
    };
    console.log(`calling: ${url}`);
    const httpsAgent = new api.https.Agent({  
         rejectUnauthorized: false
    });
    let r = await api.axios.get(url, {
        headers: {            
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 3000,       
        httpsAgent,
        proxy,
        auth, 
    });
    return r.data;    
}

corpus({
    title: `Runtime Policy configuration.`,
    input: transforms.security_policies_in,
    //output: transforms.security_policies_out,
    call: async function*(param) {
        console.log(`query`, param);       
        //await nsxApi({url: ....}) TODO:.. make a call.
        let hosts    = ['Database', 'Application', 'Web'];
        let statuses = ['active', 'failed', 'in-progress', 'delayed', 'error'];
        for (let i = 0; i < 10; i++ ) {
            let from_app_id = _.sample(hosts);
            let to_app_id   = _.sample(hosts);
            let status      = _.sample(statuses); 
            yield { policy_id: `id${i}`, from_app_id, to_app_id, status };
        }
    },
    transforms: transforms.security_policies_corpus
});

intent(`apply policy $(POLICY_ID: id0, id1, id2, id3, ...)`, async (p)=> {
    console.log(p.POLICY_ID);
    let url = `/policy/api/v1/infra/domains/${domain}/security-policies`;
    let res = await nsxApi({url});
    console.log(res);    
    p.play(`showing policy number id ${p.POLICY_ID.toString()}`);
    let mdx = await transforms.nsxT1({input: {"some": "id"}});
    p.play(mdx);    
});

projectAPI.getPolicyData = async (p, param, cb)=>{   
    let url = `/policy/api/v1/infra/domains/${domain}/security-policies`
    let res = await nsxApi({url});
    let mdx = await transforms.nsxT1({input: res.results[0]});
    mdx = await mdx.value();
    console.log(res);    
    cb(null, {status: `ok`, res, mdx});
};


corpus({
    transforms: transforms.nsx_docs_v1,
    urls: [`https://nsx.techzone.vmware.com/resource/nsx-reference-design-guide`],
});

corpus({
    urls: [        
        //`https://storage.googleapis.com/alan-ml2-public/nsx-4.1-docs/nsx-application-platform41.pdf`,  
        `https://storage.googleapis.com/alan-ml2-public/nsx-4.1-docs/nsx_41_admin.pdf`,
    ]
})

// corpus({
//     urls: [        
//         `https://storage.googleapis.com/alan-ml2-public/nsx-4.1-docs/nsx-application-platform41.pdf`,                 
//         `https://storage.googleapis.com/alan-ml2-public/nsx-4.1-docs/nsx_41_admin.pdf`,
//         `https://storage.googleapis.com/alan-ml2-public/nsx-4.1-docs/nsx_41_install.pdf`,
//         `https://storage.googleapis.com/alan-ml2-public/nsx-4.1-docs/nsx_41_migrate.pdf`,
//         `https://storage.googleapis.com/alan-ml2-public/nsx-4.1-docs/nsx_41_quick_start.pdf`,
//         `https://storage.googleapis.com/alan-ml2-public/nsx-4.1-docs/nsx_41_upgrade.pdf`,
//         `https://storage.googleapis.com/alan-ml2-public/nsx-4.1-docs/nsx_security_quick_start.pdf`,
//         `https://storage.googleapis.com/alan-ml2-public/nsx-4.1-docs/vmware-nsx-412-release-notes.pdf`,                
//     ],
//     transforms: transforms.nsx_docs_v1
// });


