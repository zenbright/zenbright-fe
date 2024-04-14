import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Upload} from 'lucide-react';
import {useRef} from 'react';
import {useState} from 'react';
import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {FailureAlert} from './alert-failure';
import {ALLOWED_EXTENSIONS, FILE_SIZE_EXCEED, FILE_UNSUPPORTED} from '../../config/constants/strings.global';

export function FileUpload() {
  const fileSelectInput = useRef(null);
  const [isUploadFailed, setIsUploadFailed] = useState(false);
  const [error, setError] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      // Process the dropped files here
      if (ALLOWED_EXTENSIONS.includes(extension) && file.size <= 25000000) {
        console.log(file); // Process the allowed file
      } else {
        if (file.size > 25000000) {
          setError({
            title: FILE_SIZE_EXCEED.TITLE,
            des: FILE_SIZE_EXCEED.DES,
          });
        } else {
          setError({
            title: FILE_UNSUPPORTED.TITLE,
            des: FILE_UNSUPPORTED.DES,
          });
        }
        setIsUploadFailed(true);
      }
    });
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <Dialog open={true}>
      <DialogContent className={`sm:max-w-[425px] ${isDragActive ? 'bg-slate-300' : 'bg-white'} `}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{'Upload your attachments'}</DialogTitle>
          <DialogDescription>
            { 'Everyone with access to this task can see the attached files.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            className={`flex flex-col justify-center w-full h-44 items-center border-dashed border-2 border-black/40 font-semibold text-black/60 ${
            isDragActive ? 'border-blue-500' : ''
            }`}
            {...getRootProps()}
          >
            <Upload className='mb-5 h-7 w-7' />

            <div className='flex gap-1 mb-1'>
              <div
                className={`font-bold hover:cursor-pointer hover:underline text-black/70`}
                onClick={() => fileSelectInput.current.click()}
              >
                {'Click to upload'}
              </div>

              {'or'}

              <div>
                {'drop your files here'}
              </div>

              <input {...getInputProps()}/>

            </div>

            <div className='text-sm'>
              {'(Maximum file size: 25MB)'}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">{'Upload'}</Button>
        </DialogFooter>

        {isUploadFailed && (
          <FailureAlert
            open={isUploadFailed}
            setOpen={setIsUploadFailed}
            title={error.title}
            des={error.des} />
        )}
      </DialogContent>
    </Dialog>
  );
}