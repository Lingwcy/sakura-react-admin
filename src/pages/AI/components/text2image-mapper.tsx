import Icon from "@/components/ui/icon";

export default function Text2ImageMapper({ data, size }: { data: string, size: number }) {
    const TEXT = 'line-md:text-box'
    const IMAGE = 'line-md:image-twotone'
    const FILE = 'line-md:file-plus'
    const AUDIO = 'line-md:soundcloud'
    let selected: string;

    switch (data) {
        case 'text': selected = TEXT; break;
        case 'image': selected = IMAGE; break;
        case 'file': selected = FILE; break;
        case 'audio': selected = AUDIO; break;
        default: return data
    }

    return (
        <Icon icon={selected} size={size} />
    )
}